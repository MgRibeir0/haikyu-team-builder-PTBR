// ===== Inicialização geral do projeto =====
// - Inicializa os dados ao carregar a página.
// - Atualiza o painel de sinergias após o carregamento inicial.

document.querySelectorAll(".hex").forEach(slot => {
    slot.addEventListener("click", (e) => {
        e.stopPropagation();
        showMenu(slot.dataset.role, slot);
    });
    slot.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        removeCharacter(slot);
    });
});

document.querySelectorAll(".bench-slot").forEach(slot => attachBenchEvents(slot));
document.addEventListener("DOMContentLoaded", async () => {
    await initData();
    updateSynergies();
});