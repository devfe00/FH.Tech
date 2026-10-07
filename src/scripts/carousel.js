document.addEventListener('DOMContentLoaded', initCarousel);

function initCarousel() {
    const track = document.getElementById('projectsCarousel');
    const indicatorsWrap = document.getElementById('carouselIndicators');
    const tabs = document.querySelectorAll('.carousel-tab');
    if (!track || !indicatorsWrap) return;

    const allCards = Array.from(track.querySelectorAll('.project-card'));
    if (allCards.length === 0) return;

    let activeCategory = 'ecommerce';

    function filterCards(category) {
        activeCategory = category;
        allCards.forEach(card => {
            card.style.display = card.dataset.category === category ? '' : 'none';
        });
        buildIndicators();
        track.scrollTo({ left: 0, behavior: 'instant' });
    }

    function visibleCards() {
        return allCards.filter(c => c.dataset.category === activeCategory);
    }

    function buildIndicators() {
        const cards = visibleCards();
        indicatorsWrap.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Projeto ${index + 1}`);
            dot.addEventListener('click', () => scrollToCard(track, cards, index));
            indicatorsWrap.appendChild(dot);
        });
    }

    function updateActiveDot() {
        const cards = visibleCards();
        const dots = indicatorsWrap.querySelectorAll('.carousel-dot');
        const activeIndex = getClosestCardIndex(track, cards);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterCards(tab.dataset.category);
        });
    });

    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveDot, 100);
    });

    const goPrev = () => {
        const cards = visibleCards();
        const current = getClosestCardIndex(track, cards);
        scrollToCard(track, cards, Math.max(current - 1, 0));
    };

    const goNext = () => {
        const cards = visibleCards();
        const current = getClosestCardIndex(track, cards);
        scrollToCard(track, cards, Math.min(current + 1, cards.length - 1));
    };

    const carousel = track.closest('.projects-carousel');
    carousel?.querySelector('.carousel-prev')?.addEventListener('click', goPrev);
    carousel?.querySelector('.carousel-next')?.addEventListener('click', goNext);

    window.previousProject = goPrev;
    window.nextProject = goNext;

    filterCards('ecommerce');
}

function getClosestCardIndex(track, cards) {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });
    return closestIndex;
}

function scrollToCard(track, cards, index) {
    const card = cards[index];
    if (!card) return;
    track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
        behavior: 'smooth',
    });
}
