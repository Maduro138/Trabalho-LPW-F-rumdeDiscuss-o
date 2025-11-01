document.addEventListener("DOMContentLoaded", () => {
    // --- 1. DECLARAÇÃO DE VARIÁVEIS ---
    // (Adicionamos nomeInput, emailInput, e textoFORCA aqui)
    const form = document.querySelector("form");
    const nomeInput = document.getElementById("nome"); // <-- Faltava
    const emailInput = document.getElementById("email"); // <-- Faltava
    const senhaInput = document.getElementById("senha");
    const senhaCONFIRMADA = document.getElementById("senhaCONFIRMADA");
    const botaodelogin = document.getElementById("botaodelogin");
    const paragrafodasenha = document.getElementById("paragrafodasenha");
    const barraINTERNA = document.getElementById("barraINTERNA");
    const textoFORCA = document.getElementById("textoFORCA"); // <-- Faltava

    // --- 2. FUNÇÕES DE VALIDAÇÃO (SEU CÓDIGO ORIGINAL) ---
    // (Seu código de validarSenhaRequisitos, calcularNIVELDESENHA, etc. entra aqui)
    // ... (Vou omitir por brevidade, mas o seu estava ótimo) ...

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
     <li style="color:${req.tamanho ? 'green' : 'red'}">mínimo 8 caracteres</li>
 <li style="color:${req.minuscula ? 'green' : 'red'}">uma letra minúscula</li>
     <li style="color:${req.maiuscula ? 'green' : 'red'}">uma letra maiúscula</li>
     <li style="color:${req.numero ? 'green' : 'red'}">um número</li>
     <li style="color:${req.especial ? 'green' : 'red'}">caractere especial</li>
 <li style="color:${(senha === confirm && senha !== '') ? 'green' : 'red'}">senhas iguais</li>
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
        
        // CORRIGIDO: Escreve a força no <p> separado
   textoFORCA.innerHTML = "Força:  " + nivel 
  return valido
    }

    // --- 3. EVENT LISTENERS ---
    senhaInput.addEventListener("input", validarSenha);
    senhaCONFIRMADA.addEventListener("input", validarSenha);

    // --- 4. ENVIO DO FORMULÁRIO (SUBMIT) ---
    // (Este é o bloco que você colou, agora DENTRO do wrapper)
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!validarSenha()) {
            alert("Por favor, corrija os erros na senha.");
            return;
        }

        // Agora 'nomeInput' e 'emailInput' existem
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
            
            if (response.ok) {
                alert(resultado);
                window.location.href = "../Pasta de login/paginadeLOGIN.html";
            } else {
                alert("Erro no cadastro: " + resultado);
            }

        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Não foi possível conectar ao servidor. Veja o console para detalhes.");
        }
    });

}); 