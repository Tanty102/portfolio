/* ============================================
   TILT — 3D tilt effect on cards
   ============================================ */
(function () {
    'use strict';

    // Skip on touch devices
    if (!window.matchMedia('(hover: hover)').matches) return;

    const CONFIG = {
        maxTilt: 15,
        perspective: 1000,
        scale: 1.02,
        speed: 300,
        glare: true,
        glareOpacity: 0.15
    };

    function initTilt(card) {
        let rect;

        // Add glare element
        if (CONFIG.glare) {
            const glare = document.createElement('div');
            glare.style.cssText = `
                position: absolute; inset: 0; pointer-events: none;
                border-radius: inherit; overflow: hidden; z-index: 2;
            `;
            const glareInner = document.createElement('div');
            glareInner.style.cssText = `
                position: absolute; width: 200%; height: 200%;
                background: linear-gradient(135deg, rgba(255,255,255,${CONFIG.glareOpacity}) 0%, transparent 50%);
                top: -50%; left: -50%;
                transform: rotate(0deg);
                transition: opacity ${CONFIG.speed}ms;
                opacity: 0;
            `;
            glare.appendChild(glareInner);
            card.style.position = 'relative';
            card.appendChild(glare);
            card._glare = glareInner;
        }

        card.style.transformStyle = 'preserve-3d';
        card.style.transition = `transform ${CONFIG.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            if (!rect) return;

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * CONFIG.maxTilt;
            const rotateX = ((centerY - y) / centerY) * CONFIG.maxTilt;

            card.style.transform = `
                perspective(${CONFIG.perspective}px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(${CONFIG.scale}, ${CONFIG.scale}, ${CONFIG.scale})
            `;

            if (card._glare) {
                const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
                card._glare.style.transform = `rotate(${angle + 180}deg)`;
                card._glare.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = `transform ${CONFIG.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
            card.style.transform = `perspective(${CONFIG.perspective}px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;

            if (card._glare) {
                card._glare.style.opacity = '0';
            }
            rect = null;
        });
    }

    // Init on existing and future elements (using MutationObserver)
    function initAllTiltCards() {
        document.querySelectorAll('.project-card').forEach(card => {
            if (!card._tiltInitialized) {
                initTilt(card);
                card._tiltInitialized = true;
            }
        });
    }

    // Observe DOM changes for dynamically added cards
    const observer = new MutationObserver(() => initAllTiltCards());
    observer.observe(document.body, { childList: true, subtree: true });

    // Init existing
    initAllTiltCards();

    // Expose for external use
    window.initTilt = initTilt;
})();
