// Tema (claro/escuro) e menu mobile
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    if (!themeIcon) return;

    body.classList.toggle('light-theme');

    themeIcon.className = body.classList.contains('light-theme')
        ? 'fas fa-moon theme-icon'
        : 'fas fa-sun theme-icon';
}

function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (!mobileMenu || !hamburger) return;

    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (!mobileMenu || !hamburger) return;

    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

window.toggleTheme = toggleTheme;
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

function bindEvents() {
    var themeBtn = document.querySelector('.theme-toggle');
    var menuBtn = document.querySelector('.menu-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    document.querySelectorAll('#mobileMenu a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
}
if (document.readyState !== 'loading') { bindEvents(); }
else { document.addEventListener('DOMContentLoaded', bindEvents); }
