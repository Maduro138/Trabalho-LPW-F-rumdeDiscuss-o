const API = "http://localhost:3000";
let usuario = localStorage.getItem("nomedousuario");
let Bemvindo = document.getElementById("Bemvindo");

    if (usuario === null) {
        usuario = "Convidado";
        Bemvindo.textContent=`Oi ${usuario} ^-^`

    }
    else{ Bemvindo.textContent=`Oi ${usuario} ^-^`
    }
// Lista de tópicos:
async function carregarTopicos(){
    const r = await fetch(API + "/topicos");
    const dados = await r.json();

    let lista = document.getElementById("listaTopicos");
    if(!lista) return;

    lista.innerHTML = "";

    dados.forEach(t=>{
        lista.innerHTML += `
            <div class="topicoCard" onclick="abrirTopico(${t.id})">
                <h3>${t.titulo}</h3>
                <small>Autor: ${t.autor}</small><br>
                <small>${t.data_criacao}</small>
            </div>
        `;
    });
}

function abrirTopico(id){
    window.location.href = `topicos.html?id=${id}`;
}


// Cria os tópicos:
async function criarTopico(){
    const titulo = document.getElementById("titulo").value;
    if (titulo ==="") {
        alert("Digite um título para o tópico");
        return
    }
    const conteudo = document.getElementById("conteudo").value;
        if (conteudo ==="") {
        alert("Digite um conteudo para o tópico");
        return
    }

    if(!usuario){
        alert("Você precisa estar logado para postar.");
        return;
    }

    const r = await fetch(API + "/topicos", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            titulo,
            conteudo,
            autor: usuario
        })
    });

    const dados = await r.json();

    if(dados.status == "ok"){
        window.location.href = "listaostopicos.html";
    }else{
        alert("Erro ao criar tópico!");
    }
}


// ver tópicos e as respostas 
async function carregarTopico(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const r = await fetch(API + "/topicos/" + id);
    const dados = await r.json();

    if(dados.erro){
        alert("Tópico não encontrado");
        return;
    }

    document.getElementById("tituloTopico").innerText = dados.topico.titulo;
    document.getElementById("conteudoTopico").innerText = dados.topico.conteudo;
    document.getElementById("autorTopico").innerText = dados.topico.autor;

    let listaRespostas = document.getElementById("listaRespostas");
    listaRespostas.innerHTML = "";

    dados.respostas.forEach(r=>{
        listaRespostas.innerHTML += `
            <div class="respostaCard">
                <p>${r.conteudo}</p>
                <small>Autor: ${r.autor}</small>
                <br><small>${r.data_criacao}</small>
            </div>
        `;
    });
}


// Envia a resposta:
async function enviarResposta(){
    const params = new URLSearchParams(window.location.search);
    const topico_id = params.get("id");

    const conteudo = document.getElementById("textoResposta").value;

    if(!usuario){
        alert("Você precisa estar logado para responder.");
        return;
    }

    const r = await fetch(API + "/respostas", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            topico_id,
            autor: usuario,
            conteudo
        })
    });

    const dados = await r.json();
    if(dados.status == "ok"){
        location.reload();
    }else{
        alert("Erro ao enviar resposta");
    }
}