// ===== Filtros e exibição da lista de personagens =====
// - Permite filtrar personagens por posição ou escola.
// - Renderiza a lista de personagens no menu lateral.

function showCharacterList() {
    const funcoes = [...new Set(characters.map(p => p.funcao))];
    const escolas = [...new Set(characters.map(p => p.School))];
    const StatsKeys = [...new Set(characters.flatMap(p => Object.keys(p.Stats || {})))];

    let html = `
    <h3>Characters</h3>
    <div class="filtros">
        <div>
            <label>Posição:</label>
            <select id="filtroFuncao">
                <option value="">Todos</option>
                ${funcoes.map(f => `<option value="${f}">${f}</option>`).join('')}
            </select>
        </div>
        <div>
            <label>Escola:</label>
            <select id="filtroEscola">
                <option value="">Todos</option>
                ${escolas.map(e => `<option value="${e}">${e}</option>`).join('')}
            </select>
        </div>
        <div>
            <label>Stats:</label>
            <select id="filtroStats">
                <option value="">Todos</option>
                ${StatsKeys.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
        </div>
                <div>
            <label>Data de lançamento esperada:</label>
            <select id="filtroDataOrdem" title="Ordenar pela data (ignora quem não tem data)">
                <option value="">Ignorar</option>
                <option value="asc">Crescente (MM/DD/YY)</option>
                <option value="desc">Decrescente (MM/DD/YY)</option>
            </select>
        </div>
<button id="limparFiltros">Limpar</button>
    </div>
<div class='char-list' id="charList"></div>
    `;

    sidebarContent.innerHTML = html;

    // Helpers de data (MM/DD/YY)
    function parseDateMMDDYY(s) {
        if (typeof s !== "string") return null;
        const m = s.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
        if (!m) return null;
        const mm = parseInt(m[1], 10), dd = parseInt(m[2], 10), yy = 2000 + parseInt(m[3], 10);
        const d = new Date(yy, mm - 1, dd);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    function hasValidDate(p) {
        return !!parseDateMMDDYY(p?.data);
    }

function getStatsSafe(p, key) {
  const v = p?.Stats?.[key];
  return (typeof v === "number") ? v : "-";
}


   function renderLista() {
  const listaEl   = document.getElementById("charList");

  const funcaoSel = (document.getElementById("filtroFuncao").value || "").trim();
  const escolaSel = (document.getElementById("filtroEscola").value || "").trim();
  let   StatsSel = (document.getElementById("filtroStats").value || "").trim();
  const dataOrdem = (document.getElementById("filtroDataOrdem")?.value || "").trim();

  if (StatsSel.toLowerCase() === "todos") StatsSel = "";

  // 1) filtro base
  let filtrados = characters.filter(p =>
    (funcaoSel === "" || p.funcao === funcaoSel) &&
    (escolaSel === "" || p.School === escolaSel)
  );

  // 2) ordenar por data quando escolhido (e ignorar sem data)
  if (dataOrdem === "asc" || dataOrdem === "desc") {
    filtrados = filtrados
      .filter(hasValidDate)
      .sort((a, b) => {
        const da = parseDateMMDDYY(a.data);
        const db = parseDateMMDDYY(b.data);
        return dataOrdem === "asc" ? (da - db) : (db - da);
      });
  } else if (StatsSel) {
    // 3) ordenar por Stats quando data está em "Ignorar"
    filtrados.sort((a, b) => {
      const bv = (b.Stats && typeof b.Stats[StatsSel] === "number") ? b.Stats[StatsSel] : -Infinity;
      const av = (a.Stats && typeof a.Stats[StatsSel] === "number") ? a.Stats[StatsSel] : -Infinity;
      return bv - av;
    });
  }

  // 4) render (agora em <li>)
  const html = filtrados.map((p, i) => {
    const metaLine =
      (dataOrdem === "asc" || dataOrdem === "desc")
        ? (hasValidDate(p) ? `<div class="card-sub">Expected Release Date: ${p.data}</div>` : "")
        : (StatsSel ? `<div class="card-sub">${StatsSel}: ${getStatsSafe(p, StatsSel)}</div>` : "");

    return `
      <li class="person-card" data-idx="${i}">
        <img src="${p.img}" alt="${p.nome}">
        <div class="card-name">${p.nome}</div>
        ${metaLine}
      </li>
    `;
  }).join("");

  listaEl.innerHTML = html;

  // 5) clique abre detalhes
  listaEl.querySelectorAll(".person-card").forEach(card => {
    card.addEventListener("click", (ev) => {
      ev.stopPropagation();  
      const idx = +card.getAttribute("data-idx");
      const person = filtrados[idx];
      if (person) showCharacterDetails(person);
    });
  });
}

    // listeners dos filtros
document.getElementById("filtroFuncao").addEventListener("change", renderLista);
document.getElementById("filtroEscola").addEventListener("change", renderLista);
document.getElementById("filtroStats").addEventListener("change", renderLista);
document.getElementById("filtroDataOrdem").addEventListener("change", renderLista);

// botão Limpar
document.getElementById("limparFiltros").addEventListener("click", () => {
  document.getElementById("filtroFuncao").value = "";
  document.getElementById("filtroEscola").value = "";
  document.getElementById("filtroStats").value = "";
  const selData = document.getElementById("filtroDataOrdem");
  if (selData) selData.value = "";
  renderLista();
});

// ⬇️ AQUI (fora do botão, depois dos listeners)
const listaEl = document.getElementById("charList");
if (listaEl && !listaEl.dataset.stopCloseBound) {
  listaEl.addEventListener("click", (ev) => ev.stopPropagation());
  listaEl.dataset.stopCloseBound = "1";
}

// primeira renderização
renderLista();
}

function showCharacterDetails(p) {
  // Normalize fields so we can safely render
  const bonds   = Array.isArray(p?.vinculo) ? p.vinculo.filter(Boolean)
                : (p?.vinculo ? [p.vinculo] : []);
  const skills  = Array.isArray(p?.habilidades) ? p.habilidades : [];
  const symbols = Array.isArray(p?.symbols) ? p.symbols : [];
  const Stats  = Array.isArray(p?.Stats) ? p.Stats : [];

  sidebarContent.innerHTML = `
    <h3>${p.nome}</h3>
    <img src="${p.img}" alt="${p.nome}" style="width:100%;">

    ${symbols.length ? `
      <div class="person-symbols">
        ${symbols.map(sym => `<img src="${sym}" class="symbol-icon">`).join("")}
      </div>` : ""}

    ${p.data ? `<p><b>Expected Release Date:</b> ${p.data}</p>` : ""}
    <p><b>Posição:</b> ${p.funcao || "-"}</p>
    <p><b>Escola:</b> ${p.School || "-"}</p>

    ${bonds.length ? `
      <p><b>Vínculos</b></p>
      <ul>
        ${bonds.map(v => `<li><button class="bond-btn bond-link" data-bond="${v}">${v}</button></li>`).join("")}
      </ul>` : `<p><b>Bonds:</b> <i>None</i></p>`}

    ${skills.length ? `
      <h4>Habilidades</h4>
      <ul>
        ${skills.map(h => `<li><button class="skill-btn" data-skill="${h.nome}">${h.nome}</button></li>`).join("")}
      </ul>` : ""}

    ${p.descricao ? `<p style="margin-top:8px;">${p.descricao}</p>` : ""}
    <ul>
            <li><b>Serve:</b> ${p.Stats.Serve}</li>
            <li><b>Spike:</b> ${p.Stats.Spike}</li>
            <li><b>Set:</b> ${p.Stats.Set}</li>
            <li><b>Receive:</b> ${p.Stats.Receive}</li>
            <li><b>Block:</b> ${p.Stats.Block}</li>
            <li><b>Save:</b> ${p.Stats.Save}</li>
        </ul>

    <button id="backToList" class="bond-btn">← Voltar</button>
  `;

  // Keep sidebar open
  sidebar.classList.add("open");
  menuBtn.style.display = "none";

  // Back to character list
  document.getElementById("backToList").addEventListener("click", (e) => {
    e.stopPropagation();
    showCharacterList();
  });

  // Open a Bond page
  sidebarContent.querySelectorAll(".bond-link").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const bondName = btn.dataset.bond;

      const relacionados = characters.filter(pers =>
        Array.isArray(pers.vinculo) ? pers.vinculo.includes(bondName)
                                    : pers.vinculo === bondName
      );

      sidebarContent.innerHTML = `
        <h3>Bond: ${bondName}</h3>
        <p>${descricoesSinergia[bondName] || "Sem descrição disponível"}</p>
        <div class="char-list">
          ${relacionados.map(r => `
            <div class="char-card" data-nome="${r.nome}">
              <img src="${r.img}" alt="${r.nome}">
              <p>${r.nome}</p>
            </div>
          `).join("")}
        </div>
        <button id="backToChar" class="bond-btn">← Voltar</button>
      `;

      sidebar.classList.add("open");
      menuBtn.style.display = "none";

      // Back to THIS character's details
      document.getElementById("backToChar").addEventListener("click", (e) => {
        e.stopPropagation();
        showCharacterDetails(p);
      });

      // Jump from bond list to another character
      sidebarContent.querySelectorAll(".char-card").forEach(card => {
        card.addEventListener("click", (e) => {
          e.stopPropagation();
          const nome = card.dataset.nome;
          const personagem = characters.find(x => x.nome === nome);
          if (personagem) showCharacterDetails(personagem);
        });
      });
    });
  });

  // Open a Skill page
  sidebarContent.querySelectorAll(".skill-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const skillName = btn.dataset.skill;
      const habilidade = skills.find(h => h.nome === skillName);
      if (!habilidade) return;

      sidebarContent.innerHTML = `
        <h3>Skill: ${habilidade.nome}</h3>
        <p>${habilidade.descricao || ""}</p>
        <button id="backToChar" class="bond-btn">← Voltar</button>
      `;
      document.getElementById("backToChar").addEventListener("click", (e) => {
        e.stopPropagation();
        showCharacterDetails(p);
      });
    });
  });
}