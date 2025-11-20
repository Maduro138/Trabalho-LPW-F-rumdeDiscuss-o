document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nomeInput = document.getElementById("nome"); 
    const emailInput = document.getElementById("email"); 
    const senhaInput = document.getElementById("senha");
    const senhaCONFIRMADA = document.getElementById("senhaCONFIRMADA");
    const botaodelogin = document.getElementById("botaodelogin");
    const paragrafodasenha = document.getElementById("paragrafodasenha");
    const barraINTERNA = document.getElementById("barraINTERNA");
    const textoFORCA = document.getElementById("textoFORCA"); 
    const botaoMostrarSenha = document.getElementById("mostrarSenha");
    const botaoMostrarConfirmacao = document.getElementById("mostrarConfirmacao");



    function validarSenhaRequisitos(senha){
    const requisitos = {
     tamanho: senha.length >= 8,
  minuscula: /[a-z]/.test(senha),
     maiuscula: /[A-Z]/.test(senha),
 numero: /[0-9]/.test(senha),
    especial: /[!@#$%^&*()]/.test(senha)
    }
    return requisitos
    }
    
    function calcularNIVELDESENHA(senha) {
     let score = 0;
    if(senha.length >= 8) score+=20
    if(/[a-z]/.test(senha)) score+=20
    if(/[A-Z]/.test(senha)) score+=20
    if(/[0-9]/.test(senha)) score+=20
    if(/[!@#$%^&*()]/.test(senha)) score+=20
    return score
    }

    function niveldoSCORE(score) {
     if (score<40) return 'Fraco'
    else if(score <70) return 'Médio'
     else return 'Forte'
    }

    function validarSenha() {
    const senha = senhaInput.value
     const confirm = senhaCONFIRMADA.value
     const req = validarSenhaRequisitos(senha)

        // Mostra a lista de requisitos
    paragrafodasenha.innerHTML = `
 <ul>
     <li style="color:${req.tamanho ? 'green' : 'red'}">Mínimo 8 caracteres</li>
 <li style="color:${req.minuscula ? 'green' : 'red'}">Uma letra minúscula</li>
     <li style="color:${req.maiuscula ? 'green' : 'red'}">Uma letra maiúscula</li>
     <li style="color:${req.numero ? 'green' : 'red'}">Um número</li>
     <li style="color:${req.especial ? 'green' : 'red'}">Caractere especial</li>
 <li style="color:${(senha === confirm && senha !== '') ? 'green' : 'red'}">Senhas devem ser iguais</li>
   </ul>
 `

   const valido = Object.values(req).every(v => v) && senha === confirm
  botaodelogin.style.backgroundColor = valido ? "green" : "red"
    const score = calcularNIVELDESENHA(senha)
 const nivel = niveldoSCORE(score)
  barraINTERNA.style.width = score + "%"
   if (nivel === "Fraco") {
   barraINTERNA.style.backgroundColor = 'red'
  } else if (nivel === "Médio") {
  barraINTERNA.style.backgroundColor = 'orange'
    } else {
 barraINTERNA.style.backgroundColor = 'green'
 }
        
       
   textoFORCA.innerHTML = "Força:  " + nivel 
  return valido
    }

    // Eventos
    senhaInput.addEventListener("input", validarSenha);
    senhaCONFIRMADA.addEventListener("input", validarSenha);

   //Envia o formulário

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!validarSenha()) {
            alert("Por favor, corrija os erros na senha.");
            return;
        }


        const dados = {
            nome: nomeInput.value,
            email: emailInput.value,
            senha: senhaInput.value
        };

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const resultado = await response.text();
            let numerodeusuarios=0;
            if (response.ok) {
                alert(resultado);
                numerodeusuarios++;
                window.location.href = "../Pasta-de-login/paginadeLOGIN.html";
            } else {
                alert("Erro no cadastro: " + resultado);
            }

        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Não foi possível conectar ao servidor. Veja o console para detalhes.");
        }
    });

    function alternarVisibilidade(inputEl, botaoEl) {
    if (!inputEl || !botaoEl) return;
    const mostrar = inputEl.type === "password";
    inputEl.type = mostrar ? "text" : "password";
    botaoEl.textContent = mostrar ? "Ocultar" : "Mostrar";
    botaoEl.setAttribute("aria-pressed", mostrar ? "true" : "false");
  }

  if (botaoMostrarSenha) {
    botaoMostrarSenha.addEventListener("click", () => alternarVisibilidade(senhaInput, botaoMostrarSenha));
    botaoMostrarSenha.textContent = "Mostrar";
    botaoMostrarSenha.setAttribute("aria-pressed", "false");
  }

  if (botaoMostrarConfirmacao) {
    botaoMostrarConfirmacao.addEventListener("click", () => alternarVisibilidade(senhaCONFIRMADA, botaoMostrarConfirmacao));
    botaoMostrarConfirmacao.textContent = "Mostrar";
    botaoMostrarConfirmacao.setAttribute("aria-pressed", "false");
  };

});
