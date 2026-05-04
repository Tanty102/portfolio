/* ============================================
   TIMELINE — Experience section draw-line + render
   ============================================ */
(function () {
    'use strict';

    const timeline = document.getElementById('timeline');
    const timelineLine = document.getElementById('timelineLine');
    if (!timeline || !timelineLine) return;

    let experienceData = [];

    /**
     * Get localized text from a multilingual field.
     * Supports both string and { vi, en, ja } object formats.
     */
    function getLocalizedText(field) {
        if (typeof field === 'string') return field;
        if (Array.isArray(field)) return field;
        if (typeof field === 'object' && field !== null) {
            const lang = window.i18n?.getLang() || 'vi';
            return field[lang] || field['en'] || Object.values(field)[0] || '';
        }
        return '';
    }

    async function loadExperience() {
        try {
            const res = await fetch('data/experience.json');
            experienceData = await res.json();
            renderTimeline(experienceData);
            initDrawLine();
        } catch (err) {
            console.warn('Failed to load experience:', err);
        }
    }

    function renderTimeline(items) {
        // Remove existing timeline items (keep the line element)
        timeline.querySelectorAll('.timeline__item').forEach(el => el.remove());

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'timeline__item';

            const role = getLocalizedText(item.role);
            const date = getLocalizedText(item.date);
            const descriptions = getLocalizedText(item.description);

            el.innerHTML = `
                <div class="timeline__dot"></div>
                <span class="timeline__date">${date}</span>
                <div class="timeline__card">
                    <h3 class="timeline__role">${role}</h3>
                    <p class="timeline__company">${item.company}</p>
                    <ul class="timeline__desc">
                        ${descriptions.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </div>
            `;
            timeline.appendChild(el);
        });
    }

    function initDrawLine() {
        // Draw line based on scroll progress through the timeline section
        function updateLine() {
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const timelineTop = rect.top;
            const timelineHeight = rect.height;

            // Calculate how much of the timeline is scrolled past
            const scrolledPast = windowHeight - timelineTop;
            const progress = Math.max(0, Math.min(1, scrolledPast / (timelineHeight + windowHeight * 0.3)));

            timelineLine.style.height = (progress * timelineHeight) + 'px';
        }

        window.addEventListener('scroll', updateLine, { passive: true });
        updateLine(); // Initial call
    }

    // Re-render timeline when language changes
    window.addEventListener('languageChanged', () => {
        if (experienceData.length > 0) {
            renderTimeline(experienceData);
        }
    });

    loadExperience();
})();
