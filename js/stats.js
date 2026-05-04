/* ============================================
   STATS — Animated counter section
   ============================================ */
(function () {
    'use strict';

    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const counters = statsSection.querySelectorAll('.stats__number');
    let hasAnimated = false;

    /**
     * Animate counting from 0 to target value with easeOutExpo easing.
     */
    function animateCounter(el, target, suffix, duration) {
        const start = performance.now();
        const isFloat = target % 1 !== 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutExpo easing
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const current = eased * target;

            if (isFloat) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isFloat) {
                    el.textContent = target.toFixed(1) + suffix;
                } else {
                    el.textContent = target.toLocaleString() + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Start all counter animations with stagger delay.
     */
    function startCounters() {
        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach((counter, index) => {
            const target = parseFloat(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const delay = index * 200;

            // Add visible class for CSS animation
            setTimeout(() => {
                const card = counter.closest('.stats__card');
                if (card) card.classList.add('stats__card--visible');
                animateCounter(counter, target, suffix, duration);
            }, delay);
        });
    }

    // Use IntersectionObserver to trigger animation when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(statsSection);
})();
