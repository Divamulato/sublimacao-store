import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://sublimacao-store.onrender.com";

export default function Admin() {

  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [visitas, setVisitas] = useState(0);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  const [imagemUrl, setImagemUrl] = useState("");
  const [imagemBase64, setImagemBase64] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  async function zerarVisitas() {
  const confirmar = window.confirm(
    "Deseja zerar todas as visitas?"
  );

  if (!confirmar) return;

  try {
    await fetch(`${API}/visitas`, {
      method: "DELETE"
    });

    setVisitas(0);

    alert("Visitas zeradas!");
  } catch (error) {
    console.error(error);
    alert("Erro ao zerar visitas");
  }
}

function sairAdmin() {
  localStorage.removeItem("adminLogado");

  navigate("/admin-login");
}
  // =========================
  // PRODUTOS
  // =========================

  async function carregarProdutos() {
    try {
      const res = await fetch(`${API}/produtos`);
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cadastrarProduto(e) {
    e.preventDefault();

    const payload = {
      nome,
      descricao,
      preco: parseFloat(preco),
      imagem: imagemBase64 || imagemUrl,
    };

    const res = await fetch(`${API}/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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

  async function deletarProduto(id) {
    if (!window.confirm("Deseja excluir este produto?")) {
      return;
    }

    await fetch(`${API}/produtos/${id}`, {
      method: "DELETE",
    });

    carregarProdutos();
  }

  async function editarProduto(produto) {
    const novoNome = prompt(
      "Novo nome:",
      produto.nome
    );

    const novaDescricao = prompt(
      "Nova descrição:",
      produto.descricao || ""
    );

    const novoPreco = prompt(
      "Novo preço:",
      produto.preco
    );

    const novaImagem = prompt(
      "Nova imagem:",
      produto.imagem || ""
    );

    if (!novoNome || !novoPreco) return;

    await fetch(`${API}/produtos/${produto.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: novoNome,
        descricao: novaDescricao,
        preco: Number(novoPreco),
        imagem: novaImagem,
      }),
    });

    carregarProdutos();
  }

  // =========================
  // PEDIDOS
  // =========================

  async function carregarPedidos() {
    try {
      const res = await fetch(`${API}/pedidos`);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function alterarStatus(id, status) {
    await fetch(
      `${API}/pedidos/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    carregarPedidos();
  }

  async function excluirPedido(id) {
    if (!window.confirm("Excluir pedido?")) {
      return;
    }

    await fetch(`${API}/pedidos/${id}`, {
      method: "DELETE",
    });

    carregarPedidos();
  }

  // =========================
  // VISITAS
  // =========================

  async function carregarVisitas() {
    try {
      const res = await fetch(`${API}/visitas`);
      const data = await res.json();

      setVisitas(data.total || 0);
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // IMAGEM
  // =========================

  function handleImageFile(e) {
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
  }

  // =========================
  // INIT
  // =========================

  useEffect(() => {

  const logado =
    localStorage.getItem(
      "adminLogado"
    );

  if (!logado) {
    navigate("/admin-login");
    return;
  }

  carregarProdutos();
  carregarPedidos();
  carregarVisitas();

}, []);

  const totalProdutos = produtos.length;
  const totalPedidos = pedidos.length;
  const pedidosFiltrados = pedidos.filter((pedido) => {
  const clienteOk =
    (pedido.cliente || "")
      .toLowerCase()
      .includes(buscaCliente.toLowerCase());

  const statusOk =
    filtroStatus === "todos"
      ? true
      : pedido.status === filtroStatus;

  return clienteOk && statusOk;
});

const hoje = new Date();

const totalHoje = pedidos
  .filter((pedido) => {
    const data = new Date(pedido.createdAt);

    return (
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  })
  .reduce(
    (acc, pedido) =>
      acc + Number(pedido.total),
    0
  );

const totalMes = pedidos
  .filter((pedido) => {
    const data = new Date(pedido.createdAt);

    return (
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  })
  .reduce(
    (acc, pedido) =>
      acc + Number(pedido.total),
    0
  );

const ticketMedio =
  totalPedidos > 0
    ? totalMes / totalPedidos
    : 0;

    return (
    <div style={{ padding: "40px" }}>
      <h1>Painel Admin</h1>
      <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <button onClick={sairAdmin}>
    Sair
  </button>
</div>

      

      <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap"
  }}
>
  <div
    style={{
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      minWidth: "180px"
    }}
  >
   <h3>Visitas</h3>

<h2>{visitas}</h2>

<button
  onClick={zerarVisitas}
  style={{
    marginTop: "10px",
    padding: "6px 12px",
    cursor: "pointer"
  }}
>
  Zerar
</button>
  </div>

  <div
    style={{
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      minWidth: "180px"
    }}
  >
    <h3>Pedidos</h3>
    <h2>{totalPedidos}</h2>
  </div>

  <div
    style={{
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      minWidth: "180px"
    }}
  >
    <h3>Produtos</h3>
    <h2>{totalProdutos}</h2>
  </div>

  <div
    style={{
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      minWidth: "180px"
    }}
  >
    <h3>Vendas Hoje</h3>
    <h2>
      R$ {totalHoje.toFixed(2)}
    </h2>
  </div>

  <div
    style={{
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      minWidth: "180px"
    }}
  >
    <h3>Vendas Mês</h3>
    <h2>
      R$ {totalMes.toFixed(2)}
    </h2>
  </div>

  <div
    style={{
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      minWidth: "180px"
    }}
  >
    <h3>Ticket Médio</h3>
    <h2>
      R$ {ticketMedio.toFixed(2)}
    </h2>
  </div>
</div>
      <hr />

      <h2>Cadastrar Produto</h2>

      <form onSubmit={cadastrarProduto}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="URL da imagem"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
        />

        <br />
        <br />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageFile}
        />

        <br />
        <br />

        {(imagemBase64 || imagemUrl) && (
          <img
            src={imagemBase64 || imagemUrl}
            alt="Preview"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
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
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px"
          }}
        >
          {p.imagem && (
            <img
              src={p.imagem}
              alt={p.nome}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          )}

          <h3>{p.nome}</h3>

          <p>{p.descricao}</p>

          <strong>
            R$ {Number(p.preco).toFixed(2)}
          </strong>

          <br />
          <br />

          <button
            onClick={() => editarProduto(p)}
          >
            Editar
          </button>

          <button
            onClick={() => deletarProduto(p.id)}
            style={{ marginLeft: "10px" }}
          >
            Excluir
          </button>
        </div>
      ))}

      <hr />
<div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap"
  }}
>
  <input
    placeholder="Buscar cliente..."
    value={buscaCliente}
    onChange={(e) =>
      setBuscaCliente(e.target.value)
    }
  />

  <select
    value={filtroStatus}
    onChange={(e) =>
      setFiltroStatus(e.target.value)
    }
  >
    <option value="todos">
      Todos
    </option>

    <option value="pendente">
      Pendente
    </option>

    <option value="pago">
      Pago
    </option>

    <option value="producao">
      Produção
    </option>

    <option value="enviado">
      Enviado
    </option>

    <option value="entregue">
      Entregue
    </option>
  </select>
</div>
      <h2>Pedidos</h2>

      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        pedidosFiltrados.map((pedido) => (
          <div
            key={pedido.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px"
            }}
          >
            <h3>
              Pedido #{pedido.id}
            </h3>

            <p>
              <strong>Cliente:</strong>{" "}
              {pedido.cliente ||
                "Não informado"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {pedido.status}
            </p>

            <p>
              <strong>Total:</strong> R${" "}
              {Number(pedido.total).toFixed(
                2
              )}
            </p>

            <p>
              <strong>Data:</strong>{" "}
              {new Date(
                pedido.createdAt
              ).toLocaleString("pt-BR")}
            </p>

            <strong>Itens:</strong>

            <ul>
              {pedido.itens?.map(
                (item, index) => (
                  <li key={index}>
                    {item.nome} x
                    {item.quantidade}
                  </li>
                )
              )}
            </ul>

            <select
              value={pedido.status}
              onChange={(e) =>
                alterarStatus(
                  pedido.id,
                  e.target.value
                )
              }
            >
              <option value="pendente">
                Pendente
              </option>

              <option value="pago">
                Pago
              </option>

              <option value="producao">
                Produção
              </option>

              <option value="enviado">
                Enviado
              </option>

              <option value="entregue">
                Entregue
              </option>
            </select>

            <button
              onClick={() =>
                excluirPedido(
                  pedido.id
                )
              }
              style={{
                marginLeft: "10px"
              }}
            >
              Excluir Pedido
            </button>
          </div>
        ))
      )}
    </div>
  );
}