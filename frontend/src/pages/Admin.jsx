import { useEffect, useState } from "react";

const API = "https://sublimacao-store.onrender.com";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  /* =========================
     🔵 CARREGAR PRODUTOS
  ========================= */
  async function carregarProdutos() {
    const res = await fetch(`${API}/produtos`);
    const data = await res.json();
    setProdutos(data);
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  /* =========================
     🟢 CADASTRAR
  ========================= */
  async function cadastrarProduto(e) {
    e.preventDefault();

    const payload = {
      nome,
      descricao,
      preco: parseFloat(preco)
    };

    const res = await fetch(`${API}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setNome("");
      setDescricao("");
      setPreco("");
      carregarProdutos();
    }
  }

  /* =========================
     🔴 DELETAR
  ========================= */
  async function deletarProduto(id) {
    await fetch(`${API}/produtos/${id}`, {
      method: "DELETE"
    });

    carregarProdutos();
  }

  /* =========================
     🟡 EDITAR (SIMPLIFICADO)
  ========================= */
  async function editarProduto(produto) {
    const novoNome = prompt("Novo nome:", produto.nome);
    const novoPreco = prompt("Novo preço:", produto.preco);

    if (!novoNome || !novoPreco) return;

    await fetch(`${API}/produtos/${produto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novoNome,
        descricao: produto.descricao,
        preco: Number(novoPreco),
        imagem: produto.imagem
      })
    });

    carregarProdutos();
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Painel Admin</h1>

      {/* FORM */}
      <form onSubmit={cadastrarProduto}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <br /><br />

        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <br /><br />

        <input type="number" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} />
        <br /><br />

        <button type="submit">Cadastrar Produto</button>
      </form>

      <hr />

      {/* LISTA */}
      <h2>Produtos</h2>

      {produtos.map((p) => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <strong>{p.nome}</strong> - R$ {p.preco}

          <br />

          <button onClick={() => deletarProduto(p.id)}>
            Deletar
          </button>

          <button onClick={() => editarProduto(p)} style={{ marginLeft: 10 }}>
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}