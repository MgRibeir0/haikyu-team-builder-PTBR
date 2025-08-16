// ===== Calcular e exibir os vínculos do time =====
// - Verifica as escolas e vínculos dos jogadores selecionados.
// - Atualiza o painel de vínculos com base nos critérios definidos.

function updateSynergies() {
    const synergyListEl = document.getElementById("synergy-list");
    synergyListEl.innerHTML = "";

    // === CONFIG: which bonds need 3 to activate ===
    // Put the EXACT vinculo names here (case-sensitive).
    const bondsRequire3 = new Set([
      "Natação",  
     "Cabeça dos Gêmeos", 
    ]);

    const DEFAULT_BOND_MIN = 2; // all bonds default to 2 unless listed above
    const SCHOOL_MIN = 4;       // school synergy rule stays the same

    const SchoolsCount = {};
    const vinculosCount = {};

    // --- Count Schools (starters only) ---
    document.querySelectorAll(".hex").forEach(slot => {
        if (slot.dataset.nome) {
            const p = characters.find(x => x.nome === slot.dataset.nome);
            if (!p) return;
            SchoolsCount[p.School] = (SchoolsCount[p.School] || 0) + 1;
        }
    });

    // --- Count Bonds (starters + bench) ---
    document.querySelectorAll(".hex, .bench-slot").forEach(slot => {
        if (slot.dataset.nome) {
            const p = characters.find(x => x.nome === slot.dataset.nome);
            if (!p) return;

            if (Array.isArray(p.vinculo)) {
                p.vinculo.forEach(v => {
                    vinculosCount[v] = (vinculosCount[v] || 0) + 1;
                });
            } else if (p.vinculo) {
                vinculosCount[p.vinculo] = (vinculosCount[p.vinculo] || 0) + 1;
            }
        }
    });

    let algumaSinergia = false;

    // --- School synergies (>= 4) ---
    for (const school in SchoolsCount) {
        if (SchoolsCount[school] >= SCHOOL_MIN) {
            synergyListEl.innerHTML += `
                <li>
                    <button class="bond-btn school-btn" data-school="${school}">
                        Escola: ${school}
                    </button>
                </li>
            `;
            algumaSinergia = true;
        }
    }

    // --- Bond synergies (>= per-bond threshold) ---
    for (const vinculo in vinculosCount) {
        const required = bondsRequire3.has(vinculo) ? 3 : DEFAULT_BOND_MIN;
        if (vinculosCount[vinculo] >= required) {
            synergyListEl.innerHTML += `
                <li>
                    <button class="bond-btn synergy-btn" data-bond="${vinculo}">
                        ${vinculo}
                    </button>
                </li>
            `;
            algumaSinergia = true;
        }
    }

    // === Click: School ===
    document.querySelectorAll(".school-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const schoolName = btn.dataset.school;

            const relacionados = characters.filter(pers => pers.School === schoolName);

            sidebarContent.innerHTML = `
                <h3>School: ${schoolName}</h3>
                <p>${descricoesSinergia[schoolName] || "Sem descrição disponível"}</p>
                <div class="char-list">
                    ${relacionados.map(r => `
                        <div class="char-card" data-nome="${r.nome}">
                            <img src="${r.img}" alt="${r.nome}">
                            <p>${r.nome}</p>
                        </div>
                    `).join('')}
                </div>
                <button id="backToSynergies" class="bond-btn">← Voltar</button>
            `;

            sidebar.classList.add("open");
            menuBtn.style.display = "none";

            document.getElementById("backToSynergies").addEventListener("click", (e) => {
                e.stopPropagation();
                updateSynergies();
                sidebar.classList.add("open");
                menuBtn.style.display = "none";
            });

            sidebarContent.querySelectorAll(".char-card").forEach(card => {
                card.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const nome = card.dataset.nome;
                    const personagem = characters.find(x => x.nome === nome);
                    showCharacterDetails(personagem);
                    sidebar.classList.add("open");
                    menuBtn.style.display = "none";
                });
            });
        });
    });

    // === Click: Bond ===
    document.querySelectorAll(".synergy-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const bondName = btn.dataset.bond;

            const relacionados = characters.filter(pers => {
                if (Array.isArray(pers.vinculo)) return pers.vinculo.includes(bondName);
                return pers.vinculo === bondName;
            });

            sidebarContent.innerHTML = `
                <h3>Vínculo: ${bondName}</h3>
                <p>${descricoesSinergia[bondName] || "Sem descrição disponível"}</p>
                <div class="char-list">
                    ${relacionados.map(r => `
                        <div class="char-card" data-nome="${r.nome}">
                            <img src="${r.img}" alt="${r.nome}">
                            <p>${r.nome}</p>
                        </div>
                    `).join('')}
                </div>
                <button id="backToSynergies" class="bond-btn">← Voltar</button>
            `;

            sidebar.classList.add("open");
            menuBtn.style.display = "none";

            document.getElementById("backToSynergies").addEventListener("click", (e) => {
                e.stopPropagation();
                updateSynergies();
                sidebar.classList.add("open");
                menuBtn.style.display = "none";
            });

            sidebarContent.querySelectorAll(".char-card").forEach(card => {
                card.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const nome = card.dataset.nome;
                    const personagem = characters.find(x => x.nome === nome);
                    showCharacterDetails(personagem);
                    sidebar.classList.add("open");
                    menuBtn.style.display = "none";
                });
            });
        });
    });

    if (!algumaSinergia) {
        synergyListEl.innerHTML = "<li>Sem sinergias ativas</li>";
    }
}