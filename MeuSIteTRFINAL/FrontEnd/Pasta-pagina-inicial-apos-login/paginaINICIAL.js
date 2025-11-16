/*document.addEventListener("DOMContentLoaded", () => {
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
    login.href = "/FrontEnd/Pasta-de-login/paginadeLOGIN.html"
    login.textContent= "Logout" 
  }


});*/

$(document).ready(function () {

  $("body").addClass("fadein");

  let nomedousuario = localStorage.getItem("nomedousuario");

  // Se vier true (string), não faz sentido — mas mantendo a lógica original
  if (nomedousuario === true) {
    nomedousuario = $.trim(nomedousuario);
  }

  if (nomedousuario === null) {
    nomedousuario = "Convidado";
    $("#Bemvindo").text(`Bem vindo ${nomedousuario} :)`);
  } else {
    $("#Bemvindo").text(`Bem vindo ${nomedousuario} :)`);
    $("#login")
      .attr("href", "/FrontEnd/Pasta-de-login/paginadeLOGIN.html")
      .text("Logout");
  }

});