/* ============================================
   PARTICLE SYSTEM — Canvas-based particles
   ============================================ */
(function () {
    'use strict';

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationId = null;
    let isVisible = true;

    const CONFIG = {
        count: window.innerWidth < 768 ? 50 : 120,
        maxDistance: 150,
        speed: 0.3,
        size: { min: 1, max: 3 },
        colors: ['rgba(0, 245, 255, 0.6)', 'rgba(184, 54, 255, 0.4)', 'rgba(255, 45, 149, 0.3)'],
        lineColor: 'rgba(0, 245, 255, 0.08)',
        mouseRadius: 200
    };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * CONFIG.speed,
            vy: (Math.random() - 0.5) * CONFIG.speed,
            size: CONFIG.size.min + Math.random() * (CONFIG.size.max - CONFIG.size.min),
            color: color,
            alpha: 0.3 + Math.random() * 0.7
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < CONFIG.count; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.maxDistance) {
                    const alpha = 1 - dist / CONFIG.maxDistance;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = CONFIG.lineColor;
                    ctx.globalAlpha = alpha * 0.5;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function update() {
        particles.forEach(p => {
            // Mouse interaction
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.mouseRadius) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                p.vx -= (dx / dist) * force * 0.02;
                p.vy -= (dy / dist) * force * 0.02;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Damping
            p.vx *= 0.999;
            p.vy *= 0.999;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Re-add small random velocity to keep particles moving
            p.vx += (Math.random() - 0.5) * 0.01;
            p.vy += (Math.random() - 0.5) * 0.01;
        });
    }

    function animate() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        drawLines();
        particles.forEach(drawParticle);
        animationId = requestAnimationFrame(animate);
    }

    // Observe visibility for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationId) {
                animate();
            } else if (!isVisible && animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.1 });

    // Event listeners
    window.addEventListener('resize', () => {
        resize();
        // Adjust particle count on resize
        const targetCount = window.innerWidth < 768 ? 50 : 120;
        while (particles.length < targetCount) particles.push(createParticle());
        while (particles.length > targetCount) particles.pop();
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Init
    init();
    observer.observe(canvas);
    animate();
})();
