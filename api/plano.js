/* ============================================================
   /api/plano — Auditor ao vivo (Claude API)
   Recebe a ideia do visitante e devolve um plano estruturado nos
   5 pilares + motion por objetivo + como aquilo vende.

   A chave da Anthropic vive SÓ aqui, via variável de ambiente na
   Vercel (ANTHROPIC_API_KEY). Nunca vai para o navegador.
   Sem dependências — usa o fetch nativo do runtime Node da Vercel.
   ============================================================ */

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
const MAX_IDEA = 1500;

const SYSTEM = `Você é o auditor do "The Pillars Method", um framework para criar sites premium que vendem. Um visitante vai te dar a ideia de um projeto e você devolve um plano prático de como construir o site aplicando os 5 pilares, e como isso vende.

Os 5 pilares:
01 Fundação — tipografia, paleta e hierarquia (80% da percepção de premium).
02 Jornada — UX e arquitetura de conversão (hero entendível em 3s, sequência psicológica, CTAs estratégicos).
03 Imersão — motion design a serviço da narrativa (scroll reveal, glassmorphism com contexto, regra dos 3 efeitos por página).
04 Mídia — vídeos/loops e imagens orgânicas, textura real, anti-plástico.
05 Performance — LCP < 2.5s, lazy load, mobile real, Lighthouse 90+.

Motion por objetivo (escolha só o que a ideia pede):
- Converter: shimmer/glow no CTA, contador de prova. Ferramenta: CSS puro. Custo zero.
- Confiança: glassmorphism, tipografia editorial, reveal escalonado. CSS/IntersectionObserver. Custo zero.
- Guiar atenção: reveal sequencial, parallax, spotlight de cursor. GSAP/Lenis. Lib leve.
- Encantar: fundo animado, tilt 3D, WebGL/shaders. Canvas/three.js/Spline. Impacto máximo.
- Reduzir fricção: skeleton, toast, transição de página. View Transitions API. Custo zero.

REGRAS:
- Seja específico para a ideia recebida (nada genérico). Português do Brasil, tom afiado e editorial, sem enrolação.
- Recomende paleta e par tipográfico concretos que combinem com o NEGÓCIO da ideia.
- Responda SOMENTE com um objeto JSON válido, sem markdown, sem texto fora do JSON, neste formato exato:
{
  "posicionamento": "uma frase de posicionamento premium para esse projeto",
  "publico": "quem é o cliente-alvo, curto",
  "pilares": [
    {"numero":"01","nome":"Fundação","acao":"o que fazer especificamente nessa ideia (paleta e fontes concretas)"},
    {"numero":"02","nome":"Jornada","acao":"..."},
    {"numero":"03","nome":"Imersão","acao":"..."},
    {"numero":"04","nome":"Mídia","acao":"..."},
    {"numero":"05","nome":"Performance","acao":"..."}
  ],
  "motion": [
    {"objetivo":"Converter","efeito":"efeito concreto","ferramenta":"ferramenta","custo":"Custo zero"}
  ],
  "comoVende": ["3 a 4 frases: por que esse site converte, o gatilho comercial de cada escolha"],
  "primeiroPasso": "a primeira ação concreta a executar hoje"
}
Inclua de 2 a 4 itens em "motion", só os objetivos que essa ideia realmente precisa.`;

function extractJson(text) {
  let t = String(text || "").trim();
  t = t.replace(/^```(?:json)?/i, "").replace(/```$/,"").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a === -1 || b === -1) throw new Error("Resposta sem JSON.");
  return JSON.parse(t.slice(a, b + 1));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: "O auditor ainda não está configurado. Falta a variável de ambiente ANTHROPIC_API_KEY na Vercel.",
    });
  }

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    if (!body) {
      body = await new Promise((resolve) => {
        let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => { try { resolve(JSON.parse(d || "{}")); } catch { resolve({}); } });
      });
    }

    const ideia = String(body.ideia || "").trim();
    if (ideia.length < 10) return res.status(400).json({ error: "Descreva sua ideia com um pouco mais de detalhe (mín. 10 caracteres)." });
    if (ideia.length > MAX_IDEA) return res.status(400).json({ error: "Ideia muito longa. Resuma em até " + MAX_IDEA + " caracteres." });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1800,
        system: SYSTEM,
        messages: [{ role: "user", content: "Minha ideia de projeto:\n\n" + ideia }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return res.status(502).json({ error: "A IA não respondeu agora. Tente de novo em instantes.", detail: detail.slice(0, 300) });
    }

    const data = await r.json();
    const text = (data.content || []).map((b) => b.text || "").join("");
    const plano = extractJson(text);

    return res.status(200).json({ plano });
  } catch (e) {
    return res.status(500).json({ error: "Não consegui montar o plano agora. Tente reformular a ideia.", detail: String(e.message || e).slice(0, 200) });
  }
}
