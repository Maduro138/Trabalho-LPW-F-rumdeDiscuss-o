document.addEventListener("DOMContentLoaded",()=>{

let Bemvindo = document.getElementById("Bemvindo")
const nomedousuario = localStorage.getItem("nomedousuario")

if (Bemvindo) {
    Bemvindo.innerHTML = 'Bem vindo '+`${nomedousuario}`+ ' :)'

}
else if(Bemvindo=== "null" ){
    Bemvindo.innerHTML = 'Bem vindo (a) :)'
}
else{

}
})

