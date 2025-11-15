document.addEventListener("DOMContentLoaded", () => {
    //  pega o token que foi salvo no localStorage durante o login
    const token = localStorage.getItem('token');

    // se não tiver token, manda o usuário de volta para o login
    if (!token) {
        alert("Acesso negado. Faça login como administrador.");
        window.location.href = "../PaginaINICIAL.html"; 
        return;
    }

    // chama a função para buscar os usuários no backend
    buscarUsuarios(token);
});

async function buscarUsuarios(token) {
    try {
        const response = await fetch("http://localhost:3000/usuarios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}` 
            }
        });

        const data = await response.json();

        if (response.ok) {
            // chama a função para mostrar os usuários na tela, html pronto para isso
            renderizarUsuarios(data);
        } else {
            // se o token for inválido ou o usuário não for admin
            alert("Erro: " + data.erro);
            // Manda de volta para a página inicial, hehehehe
             window.location.href = "../PaginaINICIAL.html";
        }

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}

function renderizarUsuarios(usuarios) {
    const listaElement = document.getElementById('lista-usuarios');
    listaElement.innerHTML = '';
    if (usuarios.length === 0) {
        listaElement.innerHTML = '<li>Nenhum usuário encontrado.</li>';
        return;
    }


    usuarios.forEach(usuario => {
        const item = document.createElement('li');
        item.textContent = `ID: ${usuario.id} - Nome: ${usuario.nome} - Email: ${usuario.email} - Role: ${usuario.role}`;
        
        // Botão de deletar para cada um
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.onclick = () => deletarUsuario(usuario.id); // Chama a função de deletar
        
        item.appendChild(deleteButton);
        listaElement.appendChild(item);
    });
}

async function deletarUsuario(id) {
    if (!confirm(`Tem certeza que deseja deletar o usuário com ID ${id}?`)) {
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/usuario/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await response.text(); // A resposta é só texto "Usuário apagado"

        if (response.ok) {
            alert(data);
            // Recarrega a lista de usuários após deletar, para melhor correspondência
            buscarUsuarios(token); 
        } else {
            alert("Erro ao deletar: " + data);
        }
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
    }
}