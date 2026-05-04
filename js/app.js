/* ============================================
   APP — Main entry point, initializations
   ============================================ */
(function () {
    'use strict';

    // Set current year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Floating cards — follow cursor slightly
    if (window.matchMedia('(hover: hover)').matches) {
        const floatingCards = document.querySelectorAll('.floating-card');
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            floatingCards.forEach((card, i) => {
                const factor = 5 + i * 2;
                card.style.transform = `translateY(${Math.sin(Date.now() / 1000 + i) * 8}px) translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    // Lazy load images with Intersection Observer
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imgObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        lazyImages.forEach(img => imgObserver.observe(img));
    }

    // Performance: reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        document.querySelectorAll('.parallax-orb, .parallax-shape').forEach(el => {
            el.style.animation = 'none';
        });
    }

    // Console easter egg
    console.log(
        '%c✦ Snake Portfolio %c\n\n' +
        'Built with ❤️ and vanilla JS\n' +
        'Try the Konami Code! ↑↑↓↓←→←→BA\n',
        'color: #00f5ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00f5ff;',
        'color: #8888a0; font-size: 12px;'
    );
})();
