
from flask import Flask, request, jsonify, send_from_directory
from pathlib import Path

app = Flask(__name__)

FRONTEND_FOLDER = Path(__file__).resolve().parent.parent / "frontend"

alunos = []


@app.route("/")
def inicio():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


@app.route("/<path:filename>")
def arquivos_frontend(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)


@app.route("/cadastro", methods=["POST"])
def cadastrar_aluno():
    dados = request.get_json()

    if not dados:
        return jsonify({
            "sucesso": False,
            "mensagem": "Nenhum dado foi enviado."
        }), 400

    nome = dados.get("nome", "").strip()
    idade = dados.get("idade")
    curso = dados.get("curso", "").strip()

    if not nome or not idade or not curso:
        return jsonify({
            "sucesso": False,
            "mensagem": "Preencha todos os campos."
        }), 400

    try:
        idade = int(idade)
    except (ValueError, TypeError):
        return jsonify({
            "sucesso": False,
            "mensagem": "A idade deve ser um número."
        }), 400

    if idade < 1 or idade > 120:
        return jsonify({
            "sucesso": False,
            "mensagem": "Digite uma idade válida."
        }), 400

    aluno = {
        "id": len(alunos) + 1,
        "nome": nome,
        "idade": idade,
        "curso": curso
    }

    alunos.append(aluno)

    return jsonify({
        "sucesso": True,
        "mensagem": "Aluno cadastrado com sucesso!",
        "aluno": aluno
    }), 201


@app.route("/alunos", methods=["GET"])
def listar_alunos():
    return jsonify(alunos)


if __name__ == "__main__":
    app.run(debug=True, port=5000)