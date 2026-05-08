/* ============================================================
   NAV.JS — navegação fixa com glass effect ao rolar
   Adiciona/remove classe baseado em scroll position
   Throttle via requestAnimationFrame (não trava o main thread)
   ============================================================ */

(function () {
    'use strict';

    const nav = document.getElementById('nav');
    if (!nav) return;

    const SCROLL_THRESHOLD = 40;   /* pixels para ativar o glass effect */
    let ticking = false;

    function updateNav() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }
        ticking = false;
    }

    /* requestAnimationFrame throttle:
       garante que updateNav rode no máximo 1x por frame (~60fps) */
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* Verifica estado inicial (se a página carrega já com scroll) */
    updateNav();
})();
