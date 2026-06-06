import { useEffect, useState } from "react";

const API = "https://sublimacao-store.onrender.com";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

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
     🖼️ UPLOAD (BASE64)
  ========================= */
  const handleImageFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagem(reader.result); // base64
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     🟢 CADASTRAR
  ========================= */
  async function cadastrarProduto(e) {
    e.preventDefault();

    const payload = {
      nome,
      descricao,
      preco: parseFloat(preco),
      imagem
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
      setImagem("");
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
     🟡 EDITAR
  ========================= */
  async function editarProduto(produto) {
    const novoNome = prompt("Novo nome:", produto.nome);
    const novaDescricao = prompt("Nova descrição:", produto.descricao);
    const novoPreco = prompt("Novo preço:", produto.preco);
    const novaImagem = prompt("Nova URL da imagem (ou base64):", produto.imagem || "");

    if (!novoNome || !novoPreco) return;

    await fetch(`${API}/produtos/${produto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novoNome,
        descricao: novaDescricao,
        preco: Number(novoPreco),
        imagem: novaImagem
      })
    });

    carregarProdutos();
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Painel Admin</h1>

      {/* FORM */}
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
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <br /><br />

        {/* URL manual */}
        <input
          placeholder="URL da imagem (opcional)"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />

        <br /><br />

        {/* UPLOAD PC */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageFile}
        />

        <br /><br />

        <button type="submit">
          Cadastrar Produto
        </button>
      </form>

      <hr />

      {/* LISTA */}
      <h2>Produtos</h2>

      {produtos.map((p) => (
        <div key={p.id} style={{ marginBottom: 20 }}>

          {p.imagem && (
            <img
              src={p.imagem}
              alt={p.nome}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                display: "block",
                marginBottom: 10
              }}
            />
          )}

          <strong>{p.nome}</strong> - R$ {p.preco}

          <br />

          <small>{p.descricao}</small>

          <br /><br />

          <button onClick={() => deletarProduto(p.id)}>
            Deletar
          </button>

          <button
            onClick={() => editarProduto(p)}
            style={{ marginLeft: 10 }}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}