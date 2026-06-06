import { useState } from "react";

export default function Admin() {

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  async function cadastrarProduto(e) {

    e.preventDefault();

    if (!nome.trim()) {
      alert("Informe o nome do produto");
      return;
    }

    if (!preco || isNaN(Number(preco))) {
      alert("Informe um preço válido");
      return;
    }

    try {

      const payload = {
        nome,
        descricao,
        preco: parseFloat(preco)
      };

      console.log("ENVIANDO:", payload);

      const res = await fetch(
        "https://sublimacao-store.onrender.com/produtos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      console.log("RESPOSTA API:");
      console.log(data);

      if (res.ok) {

        alert(
          "Produto cadastrado com sucesso!"
        );

        setNome("");
        setDescricao("");
        setPreco("");

      } else {

        alert(
          JSON.stringify(data, null, 2)
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao cadastrar produto."
      );

    }

  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Painel Admin</h1>

      <form onSubmit={cadastrarProduto}>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Cadastrar Produto
        </button>

      </form>

    </div>
  );
}