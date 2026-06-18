// Animação do título (letra a letra) e do subtítulo (efeito de digitação)
document.addEventListener('DOMContentLoaded', () => {
    initLetterAnimation();
    initTypewriter();
});

function initLetterAnimation() {
    const { matches: motionOK } = window.matchMedia('(prefers-reduced-motion: no-preference)');
    if (!motionOK) return;

    document.querySelectorAll('[split-by="letter"]').forEach((node) => {
        const letters = [...node.innerText].map((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--index', index);
            return span;
        });
        if (node.firstChild) {
            node.firstChild.replaceWith(...letters);
        }
    });
}

function initTypewriter() {
    const hackerText = document.getElementById('textHacker');
    if (!hackerText) return;

    const words = ['desenvolvedores', 'inovadores', 'criativos', 'técnicos', 'especialistas'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        hackerText.textContent = isDeleting
            ? currentWord.substring(0, charIndex - 1)
            : currentWord.substring(0, charIndex + 1);

        charIndex += isDeleting ? -1 : 1;

        let speed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 300);
}
