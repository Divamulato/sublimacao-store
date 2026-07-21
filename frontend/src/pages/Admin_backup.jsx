import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API = "https://sublimacao-store.onrender.com";

export default function Admin() {

  const navigate = useNavigate();

  // ============================
  // STATES
  // ============================

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [visitas, setVisitas] = useState(0);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
const [estoque, setEstoque] = useState("");
const [editando, setEditando] = useState(null);

  const [imagemUrl, setImagemUrl] = useState("");
  const [imagemBase64, setImagemBase64] = useState("");

  const [buscaCliente, setBuscaCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const faturamento = pedidos.reduce(
  (total, pedido) =>
    total + Number(String(pedido.total || 0).replace(",", ".")),
  0
);


const produtosFiltrados = produtos.filter((produto)=>{

  const textoBusca = busca.toLowerCase();


  const encontrou =
    produto.nome.toLowerCase().includes(textoBusca) ||
    produto.descricao.toLowerCase().includes(textoBusca);


  if(filtro === "estoque"){
    return encontrou && produto.estoque <= 5;
  }


  return encontrou;

});
const estoqueBaixo = produtos.filter(
  (produto)=>produto.estoque <= 5
).length;


  // ============================
  // LOGOUT
  // ============================

  function sairAdmin() {

    localStorage.removeItem("adminLogado");

    navigate("/admin-login");

  }

  // ============================
  // PRODUTOS
  // ============================

  async function carregarProdutos() {

    try {

      const res = await fetch(`${API}/produtos`);

      const data = await res.json();

      setProdutos(data);

    } catch (err) {

      console.error(err);

    }

  }

  async function cadastrarProduto(e) {

    e.preventDefault();

   const payload = {

  nome,

  descricao,

  preco: Number(preco),

  estoque: Number(estoque),

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

      setEstoque("");

      setImagemUrl("");

      setImagemBase64("");

      carregarProdutos();

    }

  }

  async function editarProduto(produto) {

    const novoNome =
      prompt("Novo nome", produto.nome);

    const novaDescricao =
      prompt("Descrição", produto.descricao);

    const novoPreco =
      prompt("Preço", produto.preco);

    const novaImagem =
      prompt("Imagem", produto.imagem);

    if (!novoNome) return;

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

  async function deletarProduto(id) {

    if (!window.confirm("Excluir produto?"))
      return;

    await fetch(`${API}/produtos/${id}`, {

      method: "DELETE"

    });

    carregarProdutos();

  }

  // ============================
  // PEDIDOS
  // ============================

  async function carregarPedidos() {

    try {

      const res = await fetch(`${API}/pedidos`);

      const data = await res.json();

      setPedidos(data);

    } catch (err) {

      console.error(err);

    }

  }

  async function alterarStatus(id, status) {

    await fetch(`${API}/pedidos/${id}/status`, {

      method: "PUT",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        status

      })

    });

    carregarPedidos();

  }

  async function excluirPedido(id) {

    if (!window.confirm("Excluir pedido?"))
      return;

    await fetch(`${API}/pedidos/${id}`, {

      method: "DELETE"

    });

    carregarPedidos();

  }

  // ============================
  // CLIENTES
  // ============================

  async function carregarClientes() {

    try {

      const res =
        await fetch(`${API}/clientes`);

      const data =
        await res.json();

      setClientes(data);

    } catch (err) {

      console.error(err);

    }

  }

  // ============================
  // VISITAS
  // ============================

  async function carregarVisitas() {

    try {

      const res =
        await fetch(`${API}/visitas`);

      const data =
        await res.json();

      setVisitas(data.total || 0);

    } catch (err) {

      console.error(err);

    }

  }

  async function zerarVisitas() {

    if (
      !window.confirm(
        "Deseja zerar as visitas?"
      )
    )
      return;

    await fetch(`${API}/visitas`, {

      method: "DELETE"

    });

    setVisitas(0);

  }

  // ============================
  // IMAGEM
  // ============================

  function handleImageFile(e) {

    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 500000) {

      alert(
        "Escolha uma imagem menor que 500KB."
      );

      return;

    }

    const reader = new FileReader();

    reader.onloadend = () => {

      setImagemBase64(reader.result);

    };

    reader.readAsDataURL(file);

  }

  // ============================
  // INIT
  // ============================

 useEffect(() => {

    carregarProdutos();
    carregarPedidos();
    carregarClientes();
    carregarVisitas();

}, []);

  // ============================
  // ESTATÍSTICAS
  // ============================

  const totalProdutos = produtos.length;

  const totalPedidos = pedidos.length;

  const totalClientes = clientes.length;

  const hoje = new Date();

  const pedidosFiltrados =
    pedidos.filter((pedido) => {

      const clienteOk =
        (pedido.cliente || "")
          .toLowerCase()
          .includes(
            buscaCliente.toLowerCase()
          );

      const statusOk =
        filtroStatus === "todos"
          ? true
          : pedido.status === filtroStatus;

      return clienteOk && statusOk;

    });

  const totalHoje = pedidos
    .filter((pedido) => {

      const data =
        new Date(pedido.createdAt);

      return (

        data.getDate() === hoje.getDate() &&

        data.getMonth() === hoje.getMonth() &&

        data.getFullYear() ===
          hoje.getFullYear()

      );

    })
    .reduce(
      (acc, pedido) =>
        acc + Number(pedido.total),
      0
    );

  const totalMes = pedidos
    .filter((pedido) => {

      const data =
        new Date(pedido.createdAt);

      return (

        data.getMonth() ===
          hoje.getMonth() &&

        data.getFullYear() ===
          hoje.getFullYear()

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

  // ============================
  // RETURN
  // ============================

  return (
      
    <div className="admin">

      <h1>🛠️ Painel Administrativo</h1>

      {/* RESUMO */}
      <div className="cardsAdmin">

        <div className="cardAdmin">
          <h3> 📦 Produtos</h3>
          <strong>{totalProdutos}</strong>
        </div>

        <div className="cardAdmin">
          <h3> 🛒 Pedidos</h3>
          <strong>{totalPedidos}</strong>
        </div>

        <div className="cardAdmin">
          <h3>Visitas</h3>
          <strong>{visitas}</strong>
        </div>
        <div className="cardAdmin">
  <h3>💰 Faturamento</h3>
  <strong>
    R$ {faturamento.toFixed(2)}
  </strong>
</div>

<div className="cardAdmin">
<h3>💰 Faturamento</h3>
<strong>
R$ {faturamento.toFixed(2)}
</strong>
</div>


<div className="cardAdmin">
<h3>⚠️ Estoque baixo</h3>
<strong>
{estoqueBaixo}
</strong>
</div>

      </div>


      {/* CADASTRO PRODUTO */}
      <section className="boxAdmin">

        <h2>
          {editando ? "✏️ Editar Produto" : "➕ Novo Produto"}
        </h2>


        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e)=>setNome(e.target.value)}
        />


        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e)=>setDescricao(e.target.value)}
        />


        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e)=>setPreco(e.target.value)}
        />


        <input
          type="number"
          placeholder="Estoque"
          value={estoque}
          onChange={(e)=>setEstoque(e.target.value)}
        />


        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setImagem(e.target.files[0])}
        />


       <button onClick={cadastrarProduto}>
          {editando ? "Salvar Alterações" : "Cadastrar Produto"}
        </button>


        {editando && (
          <button
            className="cancelar"
            onClick={()=>{
              setEditando(null);
              setNome("");
              setDescricao("");
              setPreco("");
              setEstoque("");
              setImagem(null);
            }}
          >
            Cancelar
          </button>
        )}

      </section>



      {/* LISTA PRODUTOS */}
     
<section className="boxAdmin">

<h2>📦 Produtos cadastrados</h2>


<div className="filtrosAdmin">


<input
type="text"
placeholder="🔎 Buscar produto..."
value={busca}
onChange={(e)=>setBusca(e.target.value)}
/>


<select
value={filtro}
onChange={(e)=>setFiltro(e.target.value)}
>

<option value="todos">
Todos
</option>


<option value="estoque">
Estoque baixo
</option>


</select>


</div>

        {produtosFiltrados.map((produto)=>(

          <div className="itemAdmin" key={produto.id}>


            <img
              src={produto.imagem}
              alt={produto.nome}
            />


            <div>

              <h3>
                {produto.nome}
              </h3>

              <p>
                {produto.descricao}
              </p>


              <strong>
                R$ {produto.preco}
              </strong>


              <p>
                Estoque: {produto.estoque}
              </p>
              {
produto.estoque <= 5 && (

<p className="alertaEstoque">
⚠️ Estoque baixo
</p>

)
}


              <button
                onClick={()=>editarProduto(produto)}
              >
                ✏️ Editar
              </button>


              <button
                className="excluir"
                onClick={()=>deletarProduto(produto.id)}
              >
                🗑️ Excluir
              </button>

            </div>


          </div>

        ))}

      </section>




      {/* PEDIDOS */}
      <section className="boxAdmin">

        <h2>🛒 Pedidos</h2>


        {pedidos.length === 0 && (
          <p>Nenhum pedido encontrado.</p>
        )}


        {pedidos.map((pedido)=>(


          <div 
            className="pedidoAdmin"
            key={pedido.id}
          >

            <h3>
              Pedido #{pedido.id}
            </h3>


            <p>
              Cliente: {pedido.nomeCliente}
            </p>


            <p>
              Total: R$ {pedido.total}
            </p>


            <select
              value={pedido.status}
              onChange={(e)=>
                alterarStatus(
                  pedido.id,
                  e.target.value
                )
              }
            >

              <option>
                Pendente
              </option>

              <option>
                Pago
              </option>

              <option>
                Produção
              </option>

              <option>
                Enviado
              </option>

              <option>
                Finalizado
              </option>

            </select>



            <button
              className="excluir"
              onClick={()=>
                excluirPedido(pedido.id)
              }
            >
              Excluir pedido
            </button>

            <button
onClick={()=>
navigate(`/admin/pedido/${pedido.id}`)
}
>
👁 Ver detalhes
</button>


          </div>


        ))}


      </section>



    </div>
  );
}