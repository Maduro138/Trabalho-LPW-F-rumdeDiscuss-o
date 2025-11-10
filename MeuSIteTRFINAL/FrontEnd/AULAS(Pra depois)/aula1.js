document.querySelectorAll('[data-copiar]').forEach(botao => {
  botao.onclick = () => {
    const alvo = document.querySelector(botao.dataset.copiar);
    navigator.clipboard.writeText(alvo.innerText);
    botao.textContent = 'Copiado!';
    setTimeout(() => botao.textContent = 'Copiar', 1000);
  };
});
