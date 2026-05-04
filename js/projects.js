/* ============================================
   PROJECTS — Load, render, filter, modal
   ============================================ */
(function () {
    'use strict';

    const grid = document.getElementById('projectsGrid');
    const filtersContainer = document.querySelector('.projects__filters');
    const modal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTech = document.getElementById('modalTech');
    const modalLinks = document.getElementById('modalLinks');
    const modalGalleryTrack = document.getElementById('modalGalleryTrack');
    const galleryDots = document.getElementById('galleryDots');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');

    if (!grid) return;

    let allProjects = [];
    let currentGalleryIndex = 0;
    let galleryLength = 0;

    // Color palette for project placeholders
    const gradients = [
        'linear-gradient(135deg, #0a2e4f, #0f4c81)',
        'linear-gradient(135deg, #2d1b69, #5b2fa3)',
        'linear-gradient(135deg, #4a1942, #8b2252)',
        'linear-gradient(135deg, #0d3b4f, #1a6b7a)',
        'linear-gradient(135deg, #1a3a1a, #2d6b2d)',
        'linear-gradient(135deg, #3d2b1f, #6b4f3a)'
    ];

    /**
     * Get localized text from a multilingual field.
     * Supports both string and { vi, en, ja } object formats.
     */
    function getLocalizedText(field) {
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) {
            const lang = window.i18n?.getLang() || 'vi';
            return field[lang] || field['en'] || Object.values(field)[0] || '';
        }
        return '';
    }

    async function loadProjects() {
        try {
            const res = await fetch('data/projects.json');
            allProjects = await res.json();
            renderProjects('all');
            buildFilterButtons();
        } catch (err) {
            console.warn('Failed to load projects:', err);
        }
    }

    function buildFilterButtons() {
        // Collect unique categories
        const categories = new Set();
        allProjects.forEach(p => p.category.forEach(c => categories.add(c)));

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'projects__filter';
            btn.dataset.filter = cat;
            btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            filtersContainer.appendChild(btn);
        });

        // Event delegation for filters
        filtersContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.projects__filter');
            if (!btn) return;

            filtersContainer.querySelectorAll('.projects__filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            filterProjects(filter);
        });
    }

    function createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.categories = project.category.join(',');

        const viewLabel = window.i18n?.get('projects.viewDetail') || 'View Detail';
        const title = getLocalizedText(project.title);
        const shortDesc = getLocalizedText(project.shortDesc);

        const imageContent = project.image
            ? `<img src="${project.image}" alt="${title}" loading="lazy">`
            : `<div class="project-card__placeholder" style="background: ${gradients[index % gradients.length]}"><span>${project.tech[0] || '🚀'}</span></div>`;

        card.innerHTML = `
            <div class="project-card__image">
                ${imageContent}
                <div class="project-card__overlay">
                    <button class="project-card__view-btn" data-project-id="${project.id}">${viewLabel}</button>
                </div>
            </div>
            <div class="project-card__info">
                <h3 class="project-card__title">${title}</h3>
                <p class="project-card__desc">${shortDesc}</p>
                <div class="project-card__tags">
                    ${project.tech.map(t => `<span class="project-card__tag">${t}</span>`).join('')}
                </div>
            </div>
        `;

        // Click to open modal
        card.addEventListener('click', () => openModal(project));

        return card;
    }

    function renderProjects(filter) {
        grid.innerHTML = '';
        const filtered = filter === 'all'
            ? allProjects
            : allProjects.filter(p => p.category.includes(filter));

        filtered.forEach((project, i) => {
            grid.appendChild(createProjectCard(project, i));
        });
    }

    function filterProjects(filter) {
        const cards = grid.querySelectorAll('.project-card');

        // Fade out all
        cards.forEach(card => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.classList.add('hiding');
        });

        // After fade out, re-render
        setTimeout(() => {
            renderProjects(filter);
            // Fade in new cards
            const newCards = grid.querySelectorAll('.project-card');
            newCards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, i * 80);
            });
        }, 400);
    }

    // === MODAL ===
    function openModal(project) {
        currentGalleryIndex = 0;

        const title = getLocalizedText(project.title);
        const description = getLocalizedText(project.description);

        modalTitle.textContent = title;
        modalDescription.textContent = description;

        // Tech stack
        modalTech.innerHTML = project.tech.map(t => `<span>${t}</span>`).join('');

        // Links — only show if actual URLs exist
        const links = [];
        if (project.demo && project.demo !== '#') {
            links.push(`<a href="${project.demo}" target="_blank" rel="noopener" class="link-demo">🔗 Live Demo</a>`);
        }
        if (project.github && project.github !== '#') {
            links.push(`<a href="${project.github}" target="_blank" rel="noopener" class="link-github">🐙 GitHub</a>`);
        }
        modalLinks.innerHTML = links.length > 0
            ? links.join('')
            : '<span style="color:var(--text-tertiary);font-size:var(--text-sm);font-style:italic">🔒 Private project</span>';

        // Gallery - use placeholder colors if no images
        if (project.images && project.images.length > 0) {
            galleryLength = project.images.length;
            modalGalleryTrack.innerHTML = project.images.map(img =>
                `<img src="${img}" alt="${title}" loading="lazy">`
            ).join('');
        } else {
            galleryLength = 3;
            modalGalleryTrack.innerHTML = Array.from({ length: 3 }, (_, i) =>
                `<div class="project-card__placeholder" style="min-width:100%;height:100%;background:${gradients[(i + project.id) % gradients.length]};display:flex;align-items:center;justify-content:center;font-size:2rem;color:rgba(255,255,255,0.3)">
                    <span>${title} — Preview ${i + 1}</span>
                </div>`
            ).join('');
        }

        // Gallery dots
        galleryDots.innerHTML = Array.from({ length: galleryLength }, (_, i) =>
            `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
        ).join('');

        updateGalleryPosition();

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateGalleryPosition() {
        modalGalleryTrack.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;
        galleryDots.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentGalleryIndex);
        });
    }

    // Gallery controls
    if (galleryPrev) galleryPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
        updateGalleryPosition();
    });

    if (galleryNext) galleryNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = Math.min(galleryLength - 1, currentGalleryIndex + 1);
        updateGalleryPosition();
    });

    if (galleryDots) galleryDots.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot');
        if (!dot) return;
        currentGalleryIndex = parseInt(dot.dataset.index);
        updateGalleryPosition();
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
                updateGalleryPosition();
            }
            if (e.key === 'ArrowRight') {
                currentGalleryIndex = Math.min(galleryLength - 1, currentGalleryIndex + 1);
                updateGalleryPosition();
            }
        }
    });

    // Re-render projects when language changes
    window.addEventListener('languageChanged', () => {
        const activeFilter = filtersContainer.querySelector('.projects__filter.active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';
        renderProjects(filter);
    });

    loadProjects();
})();
