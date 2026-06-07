// PMT Poseidon Hackz - Analisador IA (Versão com Debug)
(function() {
    const LOGO_URL = "https://pkscripts.byethost31.com/icon.png";

    function log(msg, type = "info") {
        console.log(`[PMT Poseidon] ${type.toUpperCase()}:`, msg);
    }

    function createModal() {
        log("Modal criado");
        const modal = document.createElement('div');
        modal.className = 'pmt-poseidon-modal';
        modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.97);backdrop-filter:blur(16px);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;`;
        
        modal.innerHTML = `
            <div style="background:#1E2937;width:92%;max-width:880px;border-radius:24px;border:1px solid #00C4B4;box-shadow:0 30px 80px rgba(0,0,0,0.75);overflow:hidden;">
                <div style="padding:20px 28px;background:rgba(0,196,180,0.1);border-bottom:1px solid #00C4B4;display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:14px;">
                        <img src="${LOGO_URL}" style="width:52px;height:52px;border-radius:50%;border:3px solid #00C4B4;">
                        <div>
                            <h2 style="margin:0;color:white;font-size:1.8rem;">PMT <span style="color:#00C4B4;">POSEIDON</span></h2>
                            <small style="opacity:0.8;">Analisador IA Profundo</small>
                        </div>
                    </div>
                    <button onclick="this.closest('.pmt-poseidon-modal').remove()" style="background:#ff4757;color:white;border:none;padding:10px 22px;border-radius:12px;cursor:pointer;font-weight:600;">Fechar</button>
                </div>
                <div id="pmt-content" style="padding:32px;max-height:78vh;overflow:auto;line-height:1.75;font-size:1.05rem;color:#E2E8F0;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal.querySelector('#pmt-content');
    }

    async function analyzePage(API_KEY) {
        log("Iniciando análise com chave: " + API_KEY.substring(0, 10) + "...");
        const contentArea = createModal();
        contentArea.innerHTML = `<p style="text-align:center;padding:80px;font-size:1.25rem;">Extraindo página completa e analisando...</p>`;

        try {
            let fullContent = "TÍTULO: " + document.title + "\n\n";
            
            const elements = document.querySelectorAll('h1,h2,h3,h4,p,li,td,th,article,section,main,[class*="content"]');
            elements.forEach(el => {
                if (el.innerText && el.innerText.trim().length > 20) {
                    fullContent += el.innerText.trim() + "\n\n";
                }
            });

            const prompt = `Analise profundamente esta página da Sala do Futuro e entregue insights potentes:\n\n${fullContent.slice(0, 30000)}`;

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
                    max_tokens: 2500
                })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const result = data.choices?.[0]?.message?.content || "Sem resposta.";

            contentArea.innerHTML = `<div style="white-space:pre-wrap;">${result.replace(/\n/g, '<br><br>')}</div>`;
            log("Análise concluída com sucesso", "success");

        } catch (e) {
            console.error(e);
            contentArea.innerHTML = `
                <p style="color:#ff6b6b;text-align:center;">
                    Erro: ${e.message}<br><br>
                    Verifique o console (F12) para mais detalhes.
                </p>`;
        }
    }

    window.pmtPoseidonAnalyze = function(apiKey) {
        if (!apiKey || apiKey.length < 20) {
            alert("API Key inválida!");
            return;
        }
        analyzePage(apiKey);
    };

    log("Script PMT Poseidon carregado com sucesso");
})();
