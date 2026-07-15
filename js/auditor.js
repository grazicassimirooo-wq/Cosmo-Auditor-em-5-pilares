/* ============================================================
   AUDITOR.JS — Auditor ao vivo
   Envia a ideia do visitante para /api/plano (Claude) e renderiza
   o plano nos 5 pilares. Vanilla, sem dependência.
   ============================================================ */
(function () {
    'use strict';

    var form = document.getElementById('auditorForm');
    if (!form) return;

    var input = document.getElementById('auditorInput');
    var btn = document.getElementById('auditorBtn');
    var hint = document.getElementById('auditorHint');
    var result = document.getElementById('auditorResult');
    var btnLabel = btn.innerHTML;

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function loading(on) {
        btn.disabled = on;
        input.disabled = on;
        btn.innerHTML = on
            ? '<span class="auditor__btn-loading"><span></span><span></span><span></span></span> Auditando'
            : btnLabel;
    }

    function showError(msg) {
        result.innerHTML = '<div class="auditor__error">' + esc(msg) + '</div>';
    }

    function render(p) {
        var html = '';
        if (p.posicionamento) {
            html += '<div><p class="plan-lede">' + esc(p.posicionamento) + '</p>';
            if (p.publico) html += '<p class="plan-sub">Público: ' + esc(p.publico) + '</p>';
            html += '</div>';
        }

        if (Array.isArray(p.pilares) && p.pilares.length) {
            html += '<div><p class="plan-group__title">O site, pilar por pilar</p>';
            p.pilares.forEach(function (pl) {
                html += '<div class="plan-card" style="margin-bottom:var(--space-3)">' +
                    '<span class="plan-card__num">' + esc(pl.numero || '·') + '</span>' +
                    '<div class="plan-card__body"><h4>' + esc(pl.nome || '') + '</h4>' +
                    '<p>' + esc(pl.acao || '') + '</p></div></div>';
            });
            html += '</div>';
        }

        if (Array.isArray(p.motion) && p.motion.length) {
            html += '<div><p class="plan-group__title">Motion que essa ideia pede</p><div class="plan-motion">';
            p.motion.forEach(function (m) {
                html += '<div class="plan-motion__item">' +
                    '<div class="plan-motion__obj">' + esc(m.objetivo || '') + '</div>' +
                    '<div class="plan-motion__fx">' + esc(m.efeito || '') + '</div>' +
                    '<div class="plan-motion__tool">' + esc(m.ferramenta || '') + (m.custo ? ' · ' + esc(m.custo) : '') + '</div>' +
                    '</div>';
            });
            html += '</div></div>';
        }

        if (Array.isArray(p.comoVende) && p.comoVende.length) {
            html += '<div><p class="plan-group__title">Por que isso vende</p><ul class="plan-sells">';
            p.comoVende.forEach(function (s) { html += '<li>' + esc(s) + '</li>'; });
            html += '</ul></div>';
        }

        if (p.primeiroPasso) {
            html += '<div class="plan-first"><span>Primeiro passo</span><p>' + esc(p.primeiroPasso) + '</p></div>';
        }

        result.innerHTML = html;
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ideia = (input.value || '').trim();
        if (ideia.length < 10) {
            hint.textContent = 'Conte um pouco mais sobre o projeto (mín. 10 caracteres).';
            input.focus();
            return;
        }
        hint.textContent = 'Quanto mais específico, melhor o plano.';
        result.innerHTML = '';
        loading(true);

        fetch('/api/plano', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ideia: ideia })
        })
            .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
            .then(function (res) {
                if (!res.ok || !res.j || !res.j.plano) {
                    showError((res.j && res.j.error) || 'Não consegui montar o plano agora. Tente de novo.');
                    return;
                }
                render(res.j.plano);
            })
            .catch(function () {
                showError('Falha de conexão. Verifique sua internet e tente novamente.');
            })
            .finally(function () { loading(false); });
    });
})();
