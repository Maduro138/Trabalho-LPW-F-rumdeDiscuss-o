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
      .attr("href", "/MeuSIteTRFINAL/FrontEnd/Pasta-de-login/paginadeLOGIN.html")
      .text("Logout");
  }

});

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("fadein");

    // aplicar fadeout ao trocar de página
    document.querySelectorAll("a").forEach(a => {
        // ignorar links que começam com #
        if (a.getAttribute("href")?.startsWith("#")) return;

        a.addEventListener("click", e => {
            e.preventDefault();
            let url = a.href;
            document.body.classList.remove("fadein");
            document.body.classList.add("fadeout");

            setTimeout(() => {
                window.location.href = url;
            }, 400); 
        });
    });
});

