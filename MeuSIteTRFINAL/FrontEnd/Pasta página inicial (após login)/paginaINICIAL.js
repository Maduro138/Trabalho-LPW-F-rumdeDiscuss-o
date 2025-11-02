document.addEventListener("DOMContentLoaded",()=>{

const Bemvindo = document.getElementById("Usuario")
const nomedousuario = localStorage.getItem("nomedousuario")

Bemvindo.innerHTML=`${nomedousuario}`


})

