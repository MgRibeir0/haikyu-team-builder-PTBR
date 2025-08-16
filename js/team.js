// ===== Funcionalidades relacionadas ao time =====
// - Adicionar/remover jogadores no time ou no banco.
// - Atualizar os slots de jogadores.
// - Salvar e carregar times selecionados.

function addBenchSlot() {
    const benchRow = document.getElementById("bench-row");
    const slot = document.createElement("div");
    slot.className = "player-slot bench";
    slot.innerHTML = `<div class="bench-slot" data-role="bench"></div><div class="player-info">Bench</div>`;
    benchRow.insertBefore(slot, benchRow.querySelector(".add-slot-btn"));
    attachBenchEvents(slot.querySelector(".bench-slot"));
}

function attachBenchEvents(slot) {
    slot.addEventListener("click", () => showMenu("bench", slot));
    slot.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        removeCharacter(slot);
    });
}

function showMenu(role, slot) {
    const scrollMenu = document.getElementById("scrollMenu");
    scrollMenu.innerHTML = '';
    let disponiveis;

    if (role === "bench") {
        disponiveis = characters.filter(p => !selecionados.includes(p) && respeitaLimiteBench(p, slot));
    } else {
        disponiveis = characters.filter(p => p.funcao === role && !selecionados.includes(p));
    }

    disponiveis.forEach(p => {
        const img = document.createElement('img');
        img.src = p.img;
        img.alt = p.nome;
        img.title = p.nome;
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            setCharacter(slot, p, role);
            scrollMenu.style.display = 'none';
        });
        scrollMenu.appendChild(img);
    });

    scrollMenu.style.display = 'flex';
}

function respeitaLimiteBench(p, slot) {
    const Bench = Array.from(document.querySelectorAll(".bench-slot"))
        .map(s => s.dataset.nome && characters.find(x => x.nome === s.dataset.nome))
        .filter(Boolean);

    if (slot.dataset.nome === p.nome) return true;

    const contagem = Bench.reduce((acc, cur) => {
        acc[cur.funcao] = (acc[cur.funcao] || 0) + 1;
        return acc;
    }, {});

    if (p.funcao === "MB" && contagem["MB"] >= 6) return false;
    if (p.funcao === "WS" && contagem["WS"] >= 6) return false;
    if (["S", "L", "OP"].includes(p.funcao) && contagem[p.funcao] >= 1) return false;

    return true;
}

function setCharacter(slot, personagem, role) {
    // se já tinha alguém nesse slot, remove dos selecionados
    if (slot.dataset.nome) {
        selecionados = selecionados.filter(p => p.nome !== slot.dataset.nome);
    }

    // monta imagem
    slot.innerHTML = `<img src="${personagem.img}" alt="${personagem.nome}">`;
    slot.dataset.nome = personagem.nome;

    // atualiza texto de info (procura .player-info no mesmo player-slot)
    const infoDiv = slot.parentElement.querySelector('.player-info');
    if (infoDiv) infoDiv.textContent = `${personagem.nome} - ${personagem.funcao}`;

    selecionados.push(personagem);
    updateSynergies();
}

function removeCharacter(slot) {
    if (slot.dataset.nome) {
        selecionados = selecionados.filter(p => p.nome !== slot.dataset.nome);
        slot.innerHTML = ""; 
        delete slot.dataset.nome;

        const infoDiv = slot.parentElement.querySelector('.player-info');
        if (slot.classList.contains("bench-slot")) {
            infoDiv.textContent = "Bench";
        } else {
            // tenta recuperar role
            infoDiv.textContent = slot.dataset.role || slot.getAttribute("data-role") || slot.parentElement.querySelector('.hex')?.dataset.role || "";
        }

        updateSynergies();
    }
}