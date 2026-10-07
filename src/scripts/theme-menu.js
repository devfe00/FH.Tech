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

window.toggleTheme = function(){};
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

function bindEvents() {
    var menuBtn = document.querySelector('.menu-toggle');
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    document.querySelectorAll('#mobileMenu a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
}
if (document.readyState !== 'loading') { bindEvents(); }
else { document.addEventListener('DOMContentLoaded', bindEvents); }
