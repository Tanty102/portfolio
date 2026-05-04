/* ============================================
   SKILLS — Load data, render, filter, chart animation
   ============================================ */
(function () {
    'use strict';

    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    let allSkills = [];

    async function loadSkills() {
        try {
            const res = await fetch('data/skills.json');
            allSkills = await res.json();
            renderSkills('all');
            initFilters();
        } catch (err) {
            console.warn('Failed to load skills:', err);
        }
    }

    function createSkillCard(skill) {
        const circumference = 2 * Math.PI * 34; // radius=34
        const offset = circumference - (skill.level / 100) * circumference;

        const card = document.createElement('div');
        card.className = 'skill-card';
        card.setAttribute('data-category', skill.category);
        card.innerHTML = `
            <div class="skill-card__tooltip">${skill.level}% proficiency</div>
            <div class="skill-card__chart">
                <svg viewBox="0 0 80 80">
                    <circle class="track" cx="40" cy="40" r="34"/>
                    <circle class="progress" cx="40" cy="40" r="34"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${circumference}"
                        data-target-offset="${offset}"/>
                </svg>
                <span class="skill-card__percent" data-target="${skill.level}">0%</span>
            </div>
            <div class="skill-card__icon">${skill.icon}</div>
            <div class="skill-card__name">${skill.name}</div>
        `;

        return card;
    }

    function renderSkills(filter) {
        const filtered = filter === 'all'
            ? allSkills
            : allSkills.filter(s => s.category === filter);

        grid.innerHTML = '';
        filtered.forEach(skill => {
            grid.appendChild(createSkillCard(skill));
        });

        // Animate charts on scroll
        animateCharts();
    }

    function animateCharts() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const progress = card.querySelector('.progress');
                    const percent = card.querySelector('.skill-card__percent');

                    if (progress && percent) {
                        const targetOffset = parseFloat(progress.dataset.targetOffset);
                        const targetPercent = parseInt(percent.dataset.target);

                        // Animate circle
                        setTimeout(() => {
                            progress.style.strokeDashoffset = targetOffset;
                        }, 100);

                        // Animate number
                        animateNumber(percent, 0, targetPercent, 1200);
                    }

                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.3 });

        grid.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
    }

    function animateNumber(el, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current + '%';

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function initFilters() {
        document.querySelectorAll('.skills__filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.skills__filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderSkills(btn.dataset.filter);
            });
        });
    }

    loadSkills();
})();
