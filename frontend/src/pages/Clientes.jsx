import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://sublimacao-store.onrender.com";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const res = await fetch(`${API}/clientes`);
      const data = await res.json();

      setClientes(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  if (loading) {
    return <h2>Carregando clientes...</h2>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Clientes</h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Pedidos</th>
            <th>Total gasto</th>
            <th>Status</th>
            <th>Última compra</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>

              <td>{cliente.nome}</td>

              <td>{cliente.email}</td>

              <td>{cliente.telefone}</td>

              <td>{cliente.totalPedidos}</td>

              <td>
                R$ {Number(cliente.totalGasto).toFixed(2)}
              </td>

              <td>{cliente.status}</td>

              <td>
                {cliente.ultimaCompra
                  ? new Date(
                      cliente.ultimaCompra
                    ).toLocaleDateString("pt-BR")
                  : "-"}
              </td>

              <td>
                <button
                  onClick={() =>
                    navigate(`/cliente/${cliente.id}`)
                  }
                  style={{
                    background: "#8e44ad",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Ver detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}