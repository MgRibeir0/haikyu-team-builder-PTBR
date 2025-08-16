// ===== Carregar os dados dos arquivos JSON =====

let characters = [];
let descricoesSinergia = [];
let selecionados = [];

// Carregar dados dos arquivos JSON (Deixei fetch pra quando a gente trocar pra API)
async function loadJson(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Inicializar os dados nas variáveis globais
async function initData() {
    characters = await loadJson('players.json');
    descricoesSinergia = await loadJson('synergies.json');
}
