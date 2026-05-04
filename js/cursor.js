/* ============================================
   CUSTOM CURSOR — Optimized, no-lag
   ============================================ */
(function () {
    'use strict';

    // Skip on touch devices
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    const dot = cursor.querySelector('.cursor-dot');
    const outline = cursor.querySelector('.cursor-outline');

    // GPU acceleration hints
    dot.style.willChange = 'transform';
    outline.style.willChange = 'transform';

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    let rafId = null;

    // Use passive mousemove for zero-delay capture
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));

    // Hover detection — use event delegation with minimal work
    const hoverSelector = 'a, button, input, textarea, .project-card, .skill-card, .social-link, .about__card, .timeline__card';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverSelector)) {
            cursor.classList.add('hover');
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverSelector)) {
            cursor.classList.remove('hover');
        }
    }, { passive: true });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    }, { passive: true });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    }, { passive: true });

    function animate() {
        // Faster lerp = less lag
        dotX += (mouseX - dotX) * 0.65;
        dotY += (mouseY - dotY) * 0.65;
        outlineX += (mouseX - outlineX) * 0.2;
        outlineY += (mouseY - outlineY) * 0.2;

        // Use translate3d for GPU compositing
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
        outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;

        rafId = requestAnimationFrame(animate);
    }

    // Start animation loop
    rafId = requestAnimationFrame(animate);

    // Cleanup if page hidden (tab switch)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            rafId = requestAnimationFrame(animate);
        }
    });
})();
