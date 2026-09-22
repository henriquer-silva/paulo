
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const curso = document.getElementById("curso").value;

    resultado.textContent = "Enviando cadastro...";

    try {
        const resposta = await fetch("/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                idade: idade,
                curso: curso
            })
        });

        const dados = await resposta.json();

        resultado.textContent = dados.mensagem;

        if (resposta.ok) {
            resultado.style.color = "green";
            formulario.reset();
            carregarAlunos();
        } else {
            resultado.style.color = "red";
        }

    } catch (erro) {
        resultado.textContent = "Erro ao conectar com o servidor.";
        resultado.style.color = "red";
        console.error(erro);
    }
});


async function carregarAlunos() {
    try {
        const resposta = await fetch("/alunos");
        const alunos = await resposta.json();

        let lista = document.getElementById("listaAlunos");

        if (!lista) {
            lista = document.createElement("div");
            lista.id = "listaAlunos";
            formulario.parentElement.appendChild(lista);
        }

        lista.innerHTML = "<h2>Alunos cadastrados</h2>";

        if (alunos.length === 0) {
            lista.innerHTML += "<p>Nenhum aluno cadastrado ainda.</p>";
            return;
        }

        alunos.forEach(function (aluno) {
            const item = document.createElement("p");

            item.textContent =
                `${aluno.id} - ${aluno.nome} | ${aluno.idade} anos | ${aluno.curso}`;

            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao carregar alunos:", erro);
    }
}

carregarAlunos();