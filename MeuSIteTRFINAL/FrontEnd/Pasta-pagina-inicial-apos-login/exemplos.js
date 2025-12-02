document.querySelectorAll("[data-copiar]").forEach(btn => {
  btn.addEventListener("click", () => {
    const alvo = document.querySelector(btn.dataset.copiar).innerText;
    navigator.clipboard.writeText(alvo);
    btn.innerText = "Copiado!";
    setTimeout(() => btn.innerText = "Copiar", 1200);
  });
});
