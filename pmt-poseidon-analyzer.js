// PMT Poseidon Hackz - Analisador IA Avançado
(function() {
    const LOGO_URL = "https://pkscripts.byethost31.com/icon.png";

    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'pmt-poseidon-modal';
        modal.style.cssText = `
            position:fixed; top:0; left:0; width:100%; height:100%; 
            background:rgba(15,23,42,0.97); backdrop-filter:blur(16px);
            z-index:2147483647; display:flex; align-items:center; justify-content:center;
            font-family:Inter, system-ui, sans-serif;
        `;
        modal.innerHTML = `
            <div style="background:#1E2937; width:92%; max-width:880px; border-radius:24px; border:1px solid #00C4B4; box-shadow:0 30px 80px rgba(0,0,0,0.75); overflow:hidden;">
                <div style="padding:20px 28px; background:rgba(0,196,180,0.1); border-bottom:1px solid #00C4B4; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:14px;">
                        <img src="${LOGO_URL}" style="width:52px;height:52px;border-radius:50%;border:3px solid #00C4B4;">
                        <div>
                            <h2 style="margin:0;color:white;font-size:1.8rem;">PMT <span style="color:#00C4B4;">POSEIDON</span></h2>
                            <small style="opacity:0.8;">Analisador IA Profundo</small>
                        </div>
                    </div>
                    <button onclick="this.closest('.pmt-poseidon-modal').remove()" style="background:#ff4757;color:white;border:none;padding:10px 22px;border-radius:12px;cursor:pointer;font-weight:600;">Fechar</button>
                </div>
                <div id="pmt-content" style="padding:32px; max-height:78vh; overflow:auto; line-height:1.75; font-size:1.05rem; color:#E2E8F0;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal.querySelector('#pmt-content');
    }

    async function analyzePage(API_KEY) {
        const contentArea = createModal();
        contentArea.innerHTML = `<p style="text-align:center;padding:80px;font-size:1.25rem;">Extraindo toda a estrutura da página e analisando com Groq IA...</p>`;

        // Extrai TUDO da página (texto + estrutura + elementos importantes)
        let fullContent = "";

        // 1. Título e meta
        fullContent += "TÍTULO: " + (document.title || "") + "\n\n";

        // 2. Textos principais + estrutura
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, li, td, th, .card, article, section, main, [class*="content"], [id*="content"]');
        elements.forEach(el => {
            if (el.innerText && el.innerText.trim().length > 15) {
                fullContent += el.innerText.trim() + "\n\n";
            }
        });

        // 3. HTML relevante (para contexto)
        const bodyClone = document.body.cloneNode(true);
        // Remove scripts e estilos para não poluir
        bodyClone.querySelectorAll('script, style').forEach(e => e.remove());
        fullContent += "\n\nESTRUTURA PRINCIPAL:\n" + bodyClone.innerHTML.slice(0, 8000);

        const prompt = `Você é um analista educacional de elite da Sala do Futuro (SEDUC-SP). 
Analise com profundidade máxima tudo que foi extraído da página atual e entregue uma resposta **potente, estratégica e profunda**:

${fullContent.slice(0, 32000)}`;

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    max_tokens: 2800
                })
            });

            const data = await response.json();
            const result = data.choices?.[0]?.message?.content || "Sem resposta da IA.";

            contentArea.innerHTML = `<div style="white-space: pre-wrap;">${result.replace(/\n/g, '<br><br>')}</div>`;
        } catch (e) {
            contentArea.innerHTML = `<p style="color:#ff6b6b;text-align:center;">Erro ao conectar com Groq IA.</p>`;
        }
    }

    // Expõe a função para o bookmarklet chamar
    window.pmtPoseidonAnalyze = function(apiKey) {
        analyzePage(apiKey);
    };
})();
