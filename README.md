# The Pillars Method

> Site standalone que aplica os 5 pilares do método de auditoria nele mesmo.
> Construído como prova viva do framework: editorial premium, motion sutil, performance alta.

![Preview](assets/img/preview.png)

---

## ✦ Sobre

The Pillars Method é o framework de auditoria para sites premium.
Esse repositório é o **site de apresentação do método** — e ele aplica em si mesmo cada um dos 5 pilares que ensina.

- **Pilar 01 — Fundação:** par tipográfico Fraunces + Inter, paleta editorial escura com acento coral, escala harmônica 1.25×, sistema de espaçamento 8px.
- **Pilar 02 — Jornada:** hero entendível em 3s, manifesto entre seções como bridge psicológica, CTAs estratégicos.
- **Pilar 03 — Imersão:** glassmorphism nos cards, scroll reveal escalonado, grão de fundo orgânico, hover states com profundidade.
- **Pilar 04 — Mídia:** texturas SVG inline (zero dependência), tipografia editorial italicizada como ornamento.
- **Pilar 05 — Performance:** ~3kb de JS vanilla, CSS modular, fontes via preconnect, headers de cache configurados na Vercel.

---

## ✦ Stack

| Categoria | Ferramenta | Uso |
|-----------|-----------|-----|
| Marcação | HTML5 semântico | Estrutura |
| Estilo | CSS moderno (custom properties, clamp, container queries-ready) | Layout + tema |
| Motion | Vanilla JS + Intersection Observer | Scroll reveal |
| Tipografia | Google Fonts (Fraunces + Inter) | Display + body |
| Deploy | Vercel | CDN global, cache imutável |

**Zero npm install. Zero build step.** Abre direto no navegador, deploy em 1 click.

---

## ✦ Estrutura de pastas

```
pillars-method/
├── index.html              # Página única
├── css/
│   ├── reset.css           # Reset moderno
│   ├── tokens.css          # Design tokens (cores, fontes, espaçamento)
│   ├── main.css            # Layout e componentes
│   └── animations.css      # Scroll reveal e transições
├── js/
│   ├── reveal.js           # Intersection Observer para reveal
│   └── nav.js              # Glass effect na nav ao rolar
├── assets/
│   ├── img/                # Imagens (vazio — adicione seu OG image aqui)
│   └── video/              # Vídeos hero (opcional, se quiser adicionar)
├── .gitignore
├── vercel.json             # Headers de cache e segurança
└── README.md
```

---

## ✦ Como rodar localmente

Esse projeto é HTML estático puro — nenhum bundler necessário.

**Opção 1: abrir direto**
```bash
# Clique duplo no index.html ou:
open index.html
```

**Opção 2: servidor local (recomendado para testar fontes)**
```bash
# Python (pré-instalado em Mac/Linux)
python3 -m http.server 8000

# Ou com Node, se tiver:
npx serve .
```
Abra `http://localhost:8000` no navegador.

---

## ✦ Como subir no GitHub

```bash
# 1. Inicia o repositório
git init
git add .
git commit -m "Initial commit: pillars method site"

# 2. Cria o repo no GitHub (via web ou GitHub CLI)
gh repo create pillars-method --public --source=. --push

# OU manualmente:
# - Cria repo em github.com/new
# - Conecta:
git remote add origin https://github.com/SEU-USUARIO/pillars-method.git
git branch -M main
git push -u origin main
```

---

## ✦ Como deployar na Vercel

**Opção 1: importar do GitHub (mais simples)**
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Import o repositório `pillars-method`
3. Mantenha as configurações default (a Vercel detecta o `vercel.json`)
4. Click em **Deploy**

**Opção 2: Vercel CLI**
```bash
npm i -g vercel
vercel
```

URL de produção pronta em ~30 segundos.

---

## ✦ Customização

### Trocar a paleta de cores
Edite `css/tokens.css` — todas as cores estão centralizadas em CSS custom properties.

```css
--color-bg:       #0A0A0F;   /* fundo principal */
--color-accent:   #E8593C;   /* cor de impacto */
--color-text:     #ECECEF;   /* texto principal */
```

### Trocar a tipografia
1. Pegue novo par no [Google Fonts](https://fonts.google.com)
2. Atualize o `<link>` no `<head>` do `index.html`
3. Atualize as variáveis em `css/tokens.css`:
```css
--font-display: 'Sua Fonte Display', serif;
--font-body:    'Sua Fonte Body', sans-serif;
```

### Adicionar uma seção nova
1. Adicione a seção no `index.html` com `data-reveal` nos elementos a animar
2. Estilize em `css/main.css`
3. O scroll reveal funciona automaticamente

---

## ✦ Performance esperada

Lighthouse target em produção:

- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

Sem otimização adicional. Tudo já vem configurado nos headers da Vercel.

---

## ✦ Licença

MIT — use, modifique, venda. Apenas mantenha o crédito quando aplicável.

---

**Construído aplicando o próprio método.**
