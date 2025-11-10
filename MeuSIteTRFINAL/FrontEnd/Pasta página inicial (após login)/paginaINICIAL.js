document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add('fadein');
  let Bemvindo = document.getElementById("Bemvindo");
  let login = document.getElementById("login");
  let LOGIN = document.getElementById("LOGIN")
  let nomedousuario = localStorage.getItem("nomedousuario");

  //Lógica para o nome do suario que irá aparecer na tela
  if (nomedousuario ===true) {
    nomedousuario = nomedousuario.trim();   
  } 
  
  if (nomedousuario === null) {
    nomedousuario = "Convidado";
    Bemvindo.textContent = `Bem vindo ${nomedousuario} :)`;

  }
  else{
    Bemvindo.textContent = `Bem vindo ${nomedousuario} :)`
    login.href = "/MeuSIteTRFINAL/FrontEnd/Pasta de login/paginadeLOGIN.html"
    LOGIN.textContent= "Logout"
  }


});