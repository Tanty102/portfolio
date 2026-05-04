/* ============================================
   SCROLL TO TOP — Show/hide + smooth scroll
   ============================================ */
(function () {
    'use strict';

    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    let isVisible = false;
    const SHOW_THRESHOLD = 400;

    window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > SHOW_THRESHOLD;

        if (shouldShow !== isVisible) {
            isVisible = shouldShow;
            btn.classList.toggle('visible', isVisible);
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();
