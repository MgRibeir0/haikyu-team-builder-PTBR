// ===== Gerencia o menu lateral (sidebar) =====
// - Controla a navegação entre as seções do menu (salvar/carregar, personagens, ajuda).
// - Atualiza o conteúdo do menu com base na seção selecionada.

/* ====== SIDEBAR NAV ====== */
const sidebarContent = document.getElementById("sidebar-content");
document.querySelectorAll(".menu-link").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const section = btn.dataset.section;
        if (section === "characters") {
            showCharacterList();
        } else if (section === "save") {
            showSavedTeams();
        } else if (section === "help") {
    sidebarContent.innerHTML = `
        <h3>Info</h3>
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button id="faqBtn" class="bond-btn">📄 FAQ</button>
            <button id="creditsBtn" class="bond-btn">👥 Creditos</button>
            <button id="patchBtn" class="bond-btn">🔄 Patch</button>
        </div>
    `;

    // Botão FAQ
    document.getElementById("faqBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        sidebarContent.innerHTML = `
            <h3>FAQ</h3>
            <p>Vínculos entre personagens funcionam caso alguem esteja no banco?</p>
            <p>Não, os vínculos só entrarão em vigor no jogo caso todos os jogadores do vínculo estejam em quadra</p>
            <p>"X" vínculo não aparece, porquê?</p>
            <p>Essa versão só mostra Vínculos de POSICIONAMENTO, logo os vínculos que não aparecem são vínculos normais, que só necessitam ter os jogadores na conta para serem ativos</p>
            <p>Como posso ajudar com o Team Builder?</p>
            <p>Contate gon6 no discord para mandar ideias, corrigir erros, mandar informações novas, etc</p>
            <button id="backToHelp" class="bond-btn">← Voltar</button>
        `;
        document.getElementById("backToHelp").addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelector('.menu-link[data-section="help"]').click();
            sidebar.classList.add("open");
            menuBtn.style.display = "none";
        });
    });

    // Botão Credits
    document.getElementById("patchBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        sidebarContent.innerHTML = `
            <h3>Patch notes</h3>
            <p>Correções:</p>
            <p>Algumas sinergias que precisavam de 3 jogadores não eram mostradas corretamente</p>
            <p>Algumas regras do banco não funcionavam corretamente, EX: não podia adicionar mais de 2 MBs no banco</p>
            <p>Adições:</p>
            <p>Menu Lateral</p>
            <p>Salvar e carregar times</p>
            <p>Botão de limpar o time</p>
            <p>Filtro de personagens no menu lateral</p>
            <p>Habilidades de personagens</p>
            <p>Status de personagens</p>
            <p>Data de lançamento esperada</p>
            <button id="backToHelp" class="bond-btn">← Voltar</button>
        `;
        document.getElementById("backToHelp").addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelector('.menu-link[data-section="help"]').click();
            sidebar.classList.add("open");
            menuBtn.style.display = "none";
        });
    });
               // Botão FAQ
    document.getElementById("creditsBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        sidebarContent.innerHTML = `
            <h3>Creditos</h3>
            <p>Devoy Aces: goN6 , Kari, Marin, Kaito</p>
            <p>Tradução para Inglês by KRILL group https://discord.gg/EEBqSKvAsp</p>
            <button id="backToHelp" class="bond-btn">← Voltar</button>
            
        `;
        document.getElementById("backToHelp").addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelector('.menu-link[data-section="help"]').click();
            sidebar.classList.add("open");
            menuBtn.style.display = "none";
        });
    });
}
    });
});

// pega composição atual por NOME do personagem (não por src)
function getCurrentTeamByName() {
    // titulares: procuramos .hex dentro de .player-slot (apenas as hex)
    const mainHexes = Array.from(document.querySelectorAll(".hex"));
    const main = mainHexes.map(h => h.dataset.nome || null);

    // bench: cada .bench-slot
    const benches = Array.from(document.querySelectorAll(".bench-slot"));
    const benchNames = benches.map(b => b.dataset.nome || null);

    return { main, bench: benchNames };
}

const saveTeamBtn = document.getElementById("saveTeamBtn");
saveTeamBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const teamName = prompt("Digite o nome do time:");
    if (!teamName) return;

    let teams = JSON.parse(localStorage.getItem("savedTeams") || "{}");

    if (teams[teamName]) {
        if (!confirm(`Time "${teamName}" ja está salvo. Quer substituir?`)) {
            return;
        }
    }

    teams[teamName] = getCurrentTeamByName();
    localStorage.setItem("savedTeams", JSON.stringify(teams));
    alert(`Time "${teamName}" salvo!`);

    showSavedTeams();
    sidebar.classList.add("open");
    menuBtn.style.display = "none";
});

/* mostra lista de times salvos no painel lateral */
function showSavedTeams() {
    const teams = JSON.parse(localStorage.getItem("savedTeams") || "{}");
    let html = "<h3>Saved teams</h3>";

    if (Object.keys(teams).length === 0) {
        html += "<p>No saved teams</p>";
    } else {
        html += `<div class="saved-list">`;
        for (const [name, team] of Object.entries(teams)) {
            html += `
                <div style="margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
                    <div style="text-align:left;">
                        <b>${name}</b>
                    </div>
                    <div>
                        <button class="load-btn" data-name="${name}">Carregar</button>
                        <button class="del-btn" data-name="${name}">Deletar</button>
                    </div>
                </div>
            `;
        }
        html += `</div>`;
    }

    sidebarContent.innerHTML = html;

    document.querySelectorAll(".load-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = btn.dataset.name;
        loadTeam(name);

        // Atualiza sinergias e mantém menu aberto na lista
        updateSynergies();
        sidebar.classList.add("open");
        menuBtn.style.display = "none";
        });
    });

    document.querySelectorAll(".del-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const name = btn.dataset.name;
            if (confirm(`Delete team "${name}"?`)) {
                deleteTeam(name);
                showSavedTeams();
            }
        });
    });
}

function deleteTeam(name) {
    let teams = JSON.parse(localStorage.getItem("savedTeams") || "{}");
    delete teams[name];
    localStorage.setItem("savedTeams", JSON.stringify(teams));
}

/* Carrega time — monta usando setCharacter (assim datas e selected array ficam corretos) */
function loadTeam(name) {
    const teams = JSON.parse(localStorage.getItem("savedTeams") || "{}");
    const team = teams[name];
    if (!team) return;

    selecionados = [];

    document.querySelectorAll(".hex, .bench-slot").forEach(slot => {
        slot.innerHTML = "";
        delete slot.dataset.nome;
        const infoDiv = slot.parentElement.querySelector('.player-info');
        if (infoDiv) {
            if (slot.classList.contains("bench-slot")) infoDiv.textContent = "Banco";
            else infoDiv.textContent = slot.dataset.role || slot.getAttribute("data-role") || "";
        }
    });

    const hexes = Array.from(document.querySelectorAll(".hex"));
    team.main.forEach((nome, i) => {
        if (!nome) return;
        const personagem = characters.find(p => p.nome === nome);
        if (personagem && hexes[i]) {
            setCharacter(hexes[i], personagem, hexes[i].dataset.role || hexes[i].getAttribute("data-role"));
        }
    });

    const benches = Array.from(document.querySelectorAll(".bench-slot"));
    team.bench.forEach((nome, i) => {
        if (!nome) return;
        const personagem = characters.find(p => p.nome === nome);
        if (personagem && benches[i]) {
            setCharacter(benches[i], personagem, 'bench');
            attachBenchEvents(benches[i]);
        }
    });

    // atualizar sinergias após Load
    updateSynergies();
}

/* ====== ABRIR / FECHAR MENU ====== */
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.add("open");
    menuBtn.style.display = "none";
});

closeSidebar.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.remove("open");
    menuBtn.style.display = "block";
});

// Fecha se clicar fora do painel (ignora se clicar dentro)
document.addEventListener("click", (e) => {
    // Clique dentro do sidebar ou no botão de abrir → não fecha
    if (sidebar.contains(e.target) || e.target === menuBtn) {
        return;
    }

    // Clique num personagem → não fecha
   if (e.target.closest(".char-card, .person-card, #charList")) {
  return;
}

    // Clique em botões de voltar (FAQ, Credits, Synergies, Detalhes) → não fecha
    if (
        e.target.closest("#backToHelp") ||
        e.target.closest("#backToSynergies") ||
        e.target.closest("#backToChar")
    ) {
        return;
    }

    // Fecha apenas se realmente foi fora
    if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        menuBtn.style.display = "block";
    }
});
    // Botão para limpar todo o time e resetar o banco
document.getElementById("clearTeamBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (!confirm("Certeza que quer limpar o time atual?")) return;

    // Fecha o Side Menu se estiver aberto
    sidebar.classList.remove("open");
    menuBtn.style.display = "block";

    // Limpa seleção
    selecionados = [];

    // Reseta todos os slots principais
    document.querySelectorAll(".hex").forEach(slot => {
        slot.innerHTML = "";
        delete slot.dataset.nome;
        const infoDiv = slot.parentElement.querySelector('.player-info');
        infoDiv.textContent = slot.dataset.role || slot.getAttribute("data-role") || "";
    });

    // Reseta banco para 3 slots
    const benchRow = document.getElementById("bench-row");
    benchRow.querySelectorAll(".player-slot.bench").forEach((benchSlot, index) => {
        if (index >= 3) {
            benchSlot.remove();
        } else {
            const slot = benchSlot.querySelector(".bench-slot");
            slot.innerHTML = "";
            delete slot.dataset.nome;
            const infoDiv = benchSlot.querySelector('.player-info');
            infoDiv.textContent = "Bench";
        }
    });
    updateSynergies();
    });