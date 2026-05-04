/* ============================================
   EASTER EGGS — Hidden interactions
   ============================================ */
(function () {
    'use strict';

    // === Konami Code ===
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateKonamiEaster();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateKonamiEaster() {
        // Matrix rain effect
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0.6;';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00f5ff';
            ctx.font = fontSize + 'px monospace';

            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, y * fontSize);
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
        }

        const interval = setInterval(drawMatrix, 50);

        // Remove after 5 seconds
        setTimeout(() => {
            clearInterval(interval);
            canvas.style.transition = 'opacity 1s';
            canvas.style.opacity = '0';
            setTimeout(() => canvas.remove(), 1000);
        }, 5000);
    }

    // === Logo click 5 times ===
    let logoClickCount = 0;
    let logoClickTimer = null;
    const logo = document.getElementById('navLogo');

    if (logo) {
        logo.addEventListener('click', (e) => {
            logoClickCount++;

            if (logoClickTimer) clearTimeout(logoClickTimer);
            logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 2000);

            if (logoClickCount >= 5) {
                logoClickCount = 0;
                activateRainbowMode();
            }
        });
    }

    function activateRainbowMode() {
        document.body.style.transition = 'filter 0.5s';
        let hue = 0;
        const interval = setInterval(() => {
            hue = (hue + 5) % 360;
            document.body.style.filter = `hue-rotate(${hue}deg)`;
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            document.body.style.filter = '';
        }, 6000);
    }
})();
