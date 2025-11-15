document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const dados = {
            email: emailInput.value,
            senha: senhaInput.value
        };

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            // Pega a resposta do servidor 
            const data = await response.json();

            if (response.ok) {
                // Salva o nome e o TOKEN no localStorage
                localStorage.setItem('nomedousuario', data.nome);
                localStorage.setItem('token', data.token); // O ADMIN

                // Verifica a rota 
                if (data.role === 'admin') {
    // Se for admin, vai para a pasta ADM
    alert("Login de administrador bem-sucedido!");   
    window.location.href = "../Pasta-pagina-inicial-apos-login/PastaADM/adm.html";
    
} else {
    // Se for usuário comum, vai para a página inicial
    alert("Login bem-sucedido!");
    window.location.href = "../Pasta-pagina-inicial-apos-login/PaginaINICIAL.html";
}

            } else {
                // Msg de erro
                alert("Erro no login: " + data.erro); 
            }

        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    });
});