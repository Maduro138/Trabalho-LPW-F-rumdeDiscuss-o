$(document).ready(function () {

  $("body").addClass("fadein");
  let nomedousuario = localStorage.getItem("nomedousuario");

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

