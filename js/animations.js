/* ============================================
   ANIMATIONS — GSAP ScrollTrigger + Hero anim
   ============================================ */
(function () {
    'use strict';

    // Wait for GSAP to load
    function waitForGSAP(callback) {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForGSAP(callback), 100);
        }
    }

    waitForGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // === HERO ANIMATIONS ===
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
            .to('.hero__greeting', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
            .to('.hero__title', { opacity: 1, y: 0, duration: 1 }, '-=0.4')
            .to('.hero__typing', { opacity: 1, duration: 0.6 }, '-=0.5')
            .to('.hero__description', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
            .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
            .to('.hero__scroll-indicator', { opacity: 1, duration: 0.8 }, '-=0.3');

        // === TYPING ANIMATION ===
        const typingEl = document.getElementById('typingText');
        if (typingEl) {
            const getTypingWords = () => {
                if (window.i18n && window.i18n.getTranslations()?.typing) {
                    return window.i18n.getTranslations().typing;
                }
                return ['Full-Stack Developer', 'PHP Expert', 'Problem Solver', 'UI/UX Enthusiast'];
            };

            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let words = getTypingWords();

            window.addEventListener('languageChanged', () => {
                words = getTypingWords();
            });

            function typeEffect() {
                const currentWord = words[wordIndex % words.length];

                if (!isDeleting) {
                    typingEl.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                    if (charIndex === currentWord.length) {
                        isDeleting = true;
                        setTimeout(typeEffect, 2000); // Pause at end
                        return;
                    }
                    setTimeout(typeEffect, 80 + Math.random() * 40);
                } else {
                    typingEl.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                    if (charIndex === 0) {
                        isDeleting = false;
                        wordIndex++;
                        setTimeout(typeEffect, 400);
                        return;
                    }
                    setTimeout(typeEffect, 40);
                }
            }

            // Start typing after hero animation
            setTimeout(typeEffect, 1500);
        }

        // === HERO GLOW follows mouse ===
        const heroGlow = document.getElementById('heroGlow');
        if (heroGlow) {
            document.addEventListener('mousemove', (e) => {
                heroGlow.style.left = e.clientX + 'px';
                heroGlow.style.top = e.clientY + 'px';
            });
        }

        // === HERO PARALLAX on scroll ===
        document.querySelectorAll('.hero__parallax').forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            gsap.to(layer, {
                y: () => window.innerHeight * speed * 0.5,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // === SECTION REVEAL ANIMATIONS ===
        // Fade + slide up for section titles
        gsap.utils.toArray('.section__title').forEach(title => {
            gsap.from(title, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Stagger animation for about cards
        gsap.from('.about__card', {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.about__cards',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // About avatar
        gsap.from('.about__avatar', {
            scale: 0.5,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.about__avatar',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // About bio
        gsap.from('.about__bio', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about__bio',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Skill cards stagger
        ScrollTrigger.batch('.skill-card', {
            start: 'top 85%',
            onEnter: (batch) => {
                gsap.from(batch, {
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'back.out(1.5)'
                });
            },
            once: true
        });

        // Project cards stagger
        ScrollTrigger.batch('.project-card', {
            start: 'top 85%',
            onEnter: (batch) => {
                gsap.from(batch, {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'back.out(1.4)'
                });
            },
            once: true
        });

        // Timeline items
        gsap.utils.toArray('.timeline__item').forEach((item, i) => {
            gsap.from(item, {
                x: -40,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Testimonial section
        gsap.from('.testimonials__carousel', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.testimonials__carousel',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Contact form
        gsap.from('.contact__form', {
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.contact__info', {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // Filter buttons
        gsap.from('.skills__filters', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.skills__filters',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.projects__filters', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.projects__filters',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });
})();
