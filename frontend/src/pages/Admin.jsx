import { useEffect, useState } from "react";

const API = "https://sublimacao-store.onrender.com";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  const [imagemUrl, setImagemUrl] = useState("");
  const [imagemBase64, setImagemBase64] = useState("");

async function carregarPedidos() {
  const res = await fetch(`${API}/pedidos`);
  const data = await res.json();
  setPedidos(data);
}

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
  carregarPedidos();
}, []);
  /* =========================
     🖼️ UPLOAD (BASE64)
  ========================= */
  const handleImageFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 500000) {
      alert("Escolha uma imagem menor que 500KB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagemBase64(reader.result);
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
      imagem: imagemBase64 || imagemUrl
    };

    const res = await fetch(`${API}/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setNome("");
      setDescricao("");
      setPreco("");
      setImagemUrl("");
      setImagemBase64("");

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
    const novaImagem = prompt(
      "Nova URL da imagem:",
      produto.imagem || ""
    );

    if (!novoNome || !novoPreco) return;

    await fetch(`${API}/produtos/${produto.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
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

        <input
          placeholder="URL da imagem (opcional)"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
        />

        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageFile}
        />

        <br /><br />

        {(imagemBase64 || imagemUrl) && (
          <img
            src={imagemBase64 || imagemUrl}
            alt="Preview"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              display: "block",
              marginBottom: "15px"
            }}
          />
        )}

        <button type="submit">
          Cadastrar Produto
        </button>
      </form>

      <hr />

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

          <hr />

<h2>Pedidos</h2>

{pedidos.length === 0 ? (
  <p>Nenhum pedido encontrado.</p>
) : (
  pedidos.map((pedido) => (
    <div
      key={pedido.id}
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "10px"
      }}
    >
      <h3>
        Pedido #{pedido.id}
      </h3>

      <p>
        <strong>Cliente:</strong>{" "}
        {pedido.cliente || "Não informado"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {pedido.status}
      </p>

      <p>
        <strong>Total:</strong> R${" "}
        {Number(pedido.total).toFixed(2)}
      </p>

      <p>
        <strong>Data:</strong>{" "}
        {new Date(
          pedido.createdAt
        ).toLocaleString("pt-BR")}
      </p>

      <strong>Itens:</strong>

      <ul>
        {pedido.itens?.map((item, index) => (
          <li key={index}>
            {item.nome} x{item.quantidade}
          </li>
        ))}
      </ul>
    </div>
  ))
)}
        </div>
      ))}
    </div>
  );
}