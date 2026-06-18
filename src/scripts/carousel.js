// Carrossel de projetos — baseado em scroll nativo com snap.
// Funciona com qualquer quantidade de .project-card, sem precisar
// recalcular percentuais manualmente ao adicionar/remover projetos.
document.addEventListener('DOMContentLoaded', initCarousel);

function initCarousel() {
    const track = document.getElementById('projectsCarousel');
    const indicatorsWrap = document.getElementById('carouselIndicators');
    if (!track || !indicatorsWrap) return;

    const cards = Array.from(track.querySelectorAll('.project-card'));
    if (cards.length === 0) return;

    // Gera os indicadores dinamicamente (um por card)
    indicatorsWrap.innerHTML = '';
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir para o projeto ${index + 1}`);
        dot.addEventListener('click', () => scrollToCard(track, cards, index));
        indicatorsWrap.appendChild(dot);
    });

    const updateActiveDot = () => {
        const dots = indicatorsWrap.querySelectorAll('.carousel-dot');
        const activeIndex = getClosestCardIndex(track, cards);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    };

    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveDot, 100);
    });

    const goPrev = () => {
        const current = getClosestCardIndex(track, cards);
        scrollToCard(track, cards, Math.max(current - 1, 0));
    };

    const goNext = () => {
        const current = getClosestCardIndex(track, cards);
        scrollToCard(track, cards, Math.min(current + 1, cards.length - 1));
    };

    const carousel = track.closest('.projects-carousel');
    carousel?.querySelector('.carousel-prev')?.addEventListener('click', goPrev);
    carousel?.querySelector('.carousel-next')?.addEventListener('click', goNext);

    // Mantidos também no window, caso queira chamar via onclick no HTML
    window.previousProject = goPrev;
    window.nextProject = goNext;
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
