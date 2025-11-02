document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");


    form.addEventListener("submit", async (event) => {
        // Impede que a página recarregue
        event.preventDefault(); 


        const dados = {
            email: emailInput.value,
            senha: senhaInput.value
        };

        // Aqui envio os dados para o backend
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const data = await response.json()

            if (response.ok) {

                alert(data.message); 
                localStorage.setItem('nomedousuario',data.nome)               
                 window.location.href = "../Pasta página inicial (após login)/PáginaINICIAL.html"; 
            } else {

                alert("Erro no login: " + data.message);
            }

        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
        }
    });
});