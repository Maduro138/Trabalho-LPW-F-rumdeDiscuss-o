document.addEventListener("DOMContentLoaded", () => {
    // 1. Selecionar os elementos
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    // 2. Adicionar o listener de 'submit' ao formulário
    form.addEventListener("submit", async (event) => {
        // Impede que a página recarregue
        event.preventDefault(); 

        // 3. Coletar os dados dos inputs
        const dados = {
            email: emailInput.value,
            senha: senhaInput.value
        };

        // 4. Enviar os dados para o backend (rota /login)
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const resultado = await response.text();

            if (response.ok) {
                // Se o backend retornar sucesso
                alert(resultado); // Ex: "Login realizado com sucesso!"
                
                // Opcional: Redirecionar o usuário para uma página principal
                // window.location.href = "/pagina-principal.html"; 
            } else {
                // Se o backend retornar um erro (ex: senha incorreta)
                alert("Erro no login: " + resultado); // Ex: "Senha incorreta"
            }

        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
        }
    });
});