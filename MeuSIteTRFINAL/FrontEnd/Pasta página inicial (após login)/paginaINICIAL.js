document.addEventListener("DOMContentLoaded",()=>{
    let Bemvindo = document.getElementById("Bemvindo")
    let nomedousuario = localStorage.getItem("nomedousuario")
    let login = document.getElementById("login").value

    if (nomedousuario===null) {
        nomedousuario = "Convidado"
    }
    if (Bemvindo) {
        Bemvindo.innerHTML = "Bem vindo " + `${nomedousuario}` + " :)"      
        login.innerHTML =""
    }
    else if(Bemvindo===null){
        Bemvindo.innerHTML = "Bem vindo (a) :)"
    }

})