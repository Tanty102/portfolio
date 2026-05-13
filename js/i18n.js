/* ============================================
   I18N — Internationalization (VI/EN/JA)
   ============================================ */
(function () {
    'use strict';

    const langToggle = document.getElementById('langToggle');
    const langText = langToggle?.querySelector('.lang-toggle__text');
    const langMenu = document.getElementById('langMenu');
    const langDropdown = document.getElementById('langDropdown');
    if (!langToggle || !langMenu) return;

    let translations = {};
    let currentLang = localStorage.getItem('lang') || 'en'; // Default English

    const LANG_LABELS = {
        'vi': 'VI',
        'en': 'EN',
        'ja': 'JA'
    };

    async function loadTranslations(lang) {
        try {
            const response = await fetch(`data/i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang} translations`);
            return await response.json();
        } catch (err) {
            console.warn(`i18n: Could not load ${lang}`, err);
            return null;
        }
    }

    function getNestedValue(obj, path) {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);
            if (value !== undefined) {
                if (value.includes('<')) {
                    el.innerHTML = value;
                } else {
                    el.textContent = value;
                }
            }
        });

        // Update dynamic name elements (hero title, logo, footer)
        const heroName = getNestedValue(translations, 'hero.name');
        if (heroName) {
            const heroTitle = document.querySelector('.hero__title');
            if (heroTitle) {
                heroTitle.textContent = heroName;
                heroTitle.setAttribute('data-text', heroName);
            }
            // Logo text
            const logoText = document.querySelector('.navbar__logo-text');
            if (logoText) logoText.textContent = heroName;
            // Footer logo
            const footerLogo = document.querySelector('.footer__logo');
            if (footerLogo) footerLogo.textContent = '✦ ' + heroName;
            // Footer copyright name
            const footerCopy = document.querySelector('.footer__copy');
            if (footerCopy) {
                const yearEl = document.getElementById('currentYear');
                const rightsEl = footerCopy.querySelector('[data-i18n="footer.rights"]');
                const year = yearEl ? yearEl.textContent : new Date().getFullYear();
                const rights = rightsEl ? rightsEl.outerHTML : '';
                footerCopy.innerHTML = `© <span id="currentYear">${year}</span> ${heroName}. ${rights}`;
            }
        }

        // Update html lang attribute
        document.documentElement.setAttribute('lang', currentLang);
    }

    async function setLanguage(lang) {
        const data = await loadTranslations(lang);
        if (!data) return;

        translations = data;
        currentLang = lang;
        localStorage.setItem('lang', lang);

        // Update toggle display
        if (langText) {
            langText.textContent = LANG_LABELS[lang] || lang.toUpperCase();
        }

        // Update active state in dropdown
        langMenu.querySelectorAll('.lang-dropdown__item').forEach(item => {
            item.classList.toggle('active', item.dataset.lang === lang);
        });

        applyTranslations();

        // Signal that i18n is ready (anti-FOUC)
        document.body.classList.add('i18n-ready');

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, translations } }));
    }

    // Dropdown toggle
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });

    // Language selection from dropdown
    langMenu.addEventListener('click', (e) => {
        const item = e.target.closest('.lang-dropdown__item');
        if (!item) return;

        const newLang = item.dataset.lang;
        if (newLang && newLang !== currentLang) {
            setLanguage(newLang);
        }
        langDropdown.classList.remove('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) {
            langDropdown.classList.remove('open');
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            langDropdown.classList.remove('open');
        }
    });

    // Expose for other modules
    window.i18n = {
        get: (key) => getNestedValue(translations, key),
        getLang: () => currentLang,
        getTranslations: () => translations
    };

    // Init — default to Vietnamese
    setLanguage(currentLang);
})();
