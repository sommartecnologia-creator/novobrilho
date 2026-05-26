document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const lightbox = document.getElementById('portfolioLightbox');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                projectCards.forEach(card => {
                    const matches = filter === 'all' || card.dataset.category === filter;
                    card.classList.toggle('is-hidden', !matches);
                });
            });
        });
    }

    if (!lightbox || !projectCards.length) {
        return;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeElements = document.querySelectorAll('[data-close-lightbox]');
    const prevButton = document.querySelector('.lightbox-prev');
    const nextButton = document.querySelector('.lightbox-next');
    let activeIndex = 0;

    const getVisibleProjects = () => Array.from(projectCards).filter(card => !card.classList.contains('is-hidden'));

    const buildProjectData = (card) => {
        const image = card.querySelector('img');
        const category = card.querySelector('.project-category')?.textContent?.trim() || '';
        const title = card.querySelector('h3')?.textContent?.trim() || '';
        const description = card.querySelector('p')?.textContent?.trim() || '';

        return {
            imageSrc: image?.getAttribute('src') || '',
            imageAlt: image?.getAttribute('alt') || title,
            category,
            title,
            description
        };
    };

    const renderLightbox = (index) => {
        const visibleProjects = getVisibleProjects();
        if (!visibleProjects.length) return;

        if (index < 0) index = visibleProjects.length - 1;
        if (index >= visibleProjects.length) index = 0;

        activeIndex = index;
        const data = buildProjectData(visibleProjects[activeIndex]);

        lightboxImage.src = data.imageSrc;
        lightboxImage.alt = data.imageAlt;
        lightboxCategory.textContent = data.category;
        lightboxTitle.textContent = data.title;
        lightboxDescription.textContent = data.description;
        lightboxCounter.textContent = `${activeIndex + 1} de ${visibleProjects.length}`;
    };

    const openLightbox = (card) => {
        const visibleProjects = getVisibleProjects();
        activeIndex = visibleProjects.indexOf(card);
        if (activeIndex < 0) activeIndex = 0;

        renderLightbox(activeIndex);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
    };

    projectCards.forEach(card => {
        const trigger = card.querySelector('.js-open-lightbox');
        if (!trigger) return;

        trigger.addEventListener('click', () => openLightbox(card));
    });

    closeElements.forEach(element => {
        element.addEventListener('click', closeLightbox);
    });

    if (prevButton) {
        prevButton.addEventListener('click', () => renderLightbox(activeIndex - 1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => renderLightbox(activeIndex + 1));
    }

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-open')) return;

        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') renderLightbox(activeIndex - 1);
        if (event.key === 'ArrowRight') renderLightbox(activeIndex + 1);
    });
});
