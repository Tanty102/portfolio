/* ============================================
   FORM — Contact form validation + submit
   ============================================ */
(function () {
    'use strict';

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    if (!form || !submitBtn) return;

    const fields = {
        name: { el: document.getElementById('contactName'), validate: v => v.trim().length >= 2 },
        email: { el: document.getElementById('contactEmail'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        message: { el: document.getElementById('contactMessage'), validate: v => v.trim().length >= 10 }
    };

    // Real-time validation
    Object.entries(fields).forEach(([key, field]) => {
        if (!field.el) return;

        field.el.addEventListener('input', () => {
            const group = field.el.closest('.form-group');
            if (field.validate(field.el.value)) {
                group.classList.remove('error');
            }
        });

        field.el.addEventListener('blur', () => {
            const group = field.el.closest('.form-group');
            if (!field.validate(field.el.value) && field.el.value.length > 0) {
                group.classList.add('error');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        Object.entries(fields).forEach(([key, field]) => {
            const group = field.el.closest('.form-group');
            if (!field.validate(field.el.value)) {
                group.classList.add('error');
                isValid = false;
            } else {
                group.classList.remove('error');
            }
        });

        if (!isValid) return;

        // Simulate form submission
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            // Reset form after success
            setTimeout(() => {
                form.reset();
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
            }, 2500);

        } catch (err) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            console.error('Form submission error:', err);
        }
    });
})();
