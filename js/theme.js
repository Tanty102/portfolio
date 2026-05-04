/* ============================================
   THEME — Dark/Light mode toggle
   ============================================ */
(function () {
    'use strict';

    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const darkIcon = toggle.querySelector('.theme-icon--dark');
    const lightIcon = toggle.querySelector('.theme-icon--light');
    const html = document.documentElement;

    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme) {
        // Add transition class for smooth morphing
        document.body.classList.add('theme-transitioning');

        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            darkIcon.style.display = '';
            lightIcon.style.display = 'none';
        } else {
            darkIcon.style.display = 'none';
            lightIcon.style.display = '';
        }

        // Update meta theme color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0a0a0f' : '#f5f5fa');
        }

        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 600);
    }

    // Init theme
    setTheme(getPreferredTheme());

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
})();
