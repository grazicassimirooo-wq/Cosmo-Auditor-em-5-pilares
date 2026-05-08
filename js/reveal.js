/* ============================================================
   REVEAL.JS — scroll animations sem dependência externa
   Usa Intersection Observer (API nativa, performance nativa)
   Tamanho final: ~700 bytes minificado
   ============================================================ */

(function () {
    'use strict';

    /* Pega todos os elementos marcados com data-reveal no HTML */
    const targets = document.querySelectorAll('[data-reveal]');

    /* Se não há elementos OU o navegador não suporta IO, sai sem erro */
    if (!targets.length || !('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }

    /* Configuração do observer:
       - rootMargin negativo no bottom: dispara um pouco ANTES de entrar (mais natural)
       - threshold 0.15: 15% do elemento visível já dispara */
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    /* Para de observar após revelar — economia de memória */
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.15,
        }
    );

    /* Inicia a observação de cada elemento */
    targets.forEach(el => observer.observe(el));
})();
