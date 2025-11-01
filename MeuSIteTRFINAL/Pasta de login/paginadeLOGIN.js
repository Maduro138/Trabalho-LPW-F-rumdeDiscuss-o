document.addEventListener("DOMContentLoaded",()=>{
const botaodelogin = document.getElementById("botaodelogin");
const senhaInput = document.getElementById("senha")
const form = document.querySelector("form")
const senhaCONFIRMADA = document.getElementById("senhaCONFIRMADA")
const paragrafodesenha = document.getElementById("paragrafodesenha")

const regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
function validarSenha() {

    const senha =senhaInput.value
    const validacaodesenha = senhaCONFIRMADA.value
    const senhaValida = regexSenhaForte.test(senha)

    if (senhaValida && (validacaodesenha === senha)) {

        paragrafodesenha.innerHTML='Senha legal'
        alert("Senha válida, amigo")
        botaodelogin.style.backgroundColor="green"
      /*  botaodelogin.style.color="white"
        botaodelogin.style.border = '1px solid black';     
    */
   }
    else{
        paragrafodesenha.innerHTML='Senha ruim'
        botaodelogin.style.backgroundColor="red"
        alert("Sua senha não atingiu todos os requerimentos, verifique-os novamente")
    }
    return senhaValida   
}

senhaInput.addEventListener("input", validarSenha);
/*
form.addEventListener("submit",(event)=>{
    if(!validarSenha()){
        event.preventDefault()
        alert("Senha deve seguir os aspectos ditos!");
    }
    else{
        alert("Senha bem sucedida!")
    }
})
*/
validarSenha();    
})

