document.addEventListener("DOMContentLoaded", () => {
  
  let Bemvindo = document.getElementById("Bemvindo");
  let login = document.getElementById("login");
  let nomedousuario = localStorage.getItem("nomedousuario");

  if (nomedousuario) {
    nomedousuario = nomedousuario.trim();
    
  } 
  
  if (nomedousuario === "") {
    nomedousuario = "Convidado";
    
  }

  if (Bemvindo) {
    Bemvindo.textContent = `Bem vindo ${nomedousuario} :)`;
    login = "";
  }

  else {
      login = "";
    }
});