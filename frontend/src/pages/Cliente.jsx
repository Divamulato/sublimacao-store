import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Cliente.css";

const API = "https://sublimacao-store.onrender.com";

export default function Cliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCliente();
  }, []);

  async function carregarCliente() {
    try {
      const res = await fetch(`${API}/clientes/${id}`);
      const data = await res.json();

      setCliente(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  if (loading) {
    return <h2>Carregando cliente...</h2>;
  }

  if (!cliente) {
    return <h2>Cliente não encontrado</h2>;
  }

  return (
    <div className="cliente-page">
      <button
        className="voltar-btn"
        onClick={() => navigate("/clientes")}
      >
        ← Voltar
      </button>

      <h1>{cliente.nome}</h1>

      <div className="resumo">
        <div className="card">
          <span>Pedidos</span>
          <strong>{cliente.totalPedidos}</strong>
        </div>

        <div className="card">
          <span>Total gasto</span>
          <strong>
            R$ {cliente.totalGasto.toFixed(2)}
          </strong>
        </div>

        <div className="card">
          <span>Cadastro</span>
          <strong>
            {new Date(cliente.createdAt).toLocaleDateString("pt-BR")}
          </strong>
        </div>
      </div>

      <div className="dados">
        <h2>Dados do cliente</h2>

        <p><strong>Email:</strong> {cliente.email}</p>

        <p><strong>Telefone:</strong> {cliente.telefone}</p>
      </div>

      <div className="historico">
        <h2>Histórico de pedidos</h2>

        {cliente.pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          cliente.pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-topo">
                <h3>Pedido Nº {pedido.id}</h3>

                <span className={`status ${pedido.status}`}>
                  {pedido.status}
                </span>
              </div>

              <p>
                <strong>Data:</strong>{" "}
                {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
              </p>

              <p>
                <strong>Total:</strong> R$ {pedido.total.toFixed(2)}
              </p>

              <h4>Itens</h4>

              <ul>
                {pedido.itens.map((item, index) => (
                  <li key={index}>
                    {item.nome} x{item.quantidade} — R$ {item.preco}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}