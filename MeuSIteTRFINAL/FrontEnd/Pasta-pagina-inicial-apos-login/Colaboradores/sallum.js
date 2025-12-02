function abrirModal() {
    document.getElementById("modalColaboradores").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalColaboradores").style.display = "none";
}

window.onclick = function(e) {
    const modal = document.getElementById("modalColaboradores");
    if (e.target === modal) fecharModal();
}