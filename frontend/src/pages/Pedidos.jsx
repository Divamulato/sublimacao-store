import { useEffect, useState } from "react";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("pedidos")) || [];
    setPedidos(dados);
  }, []);

  if (pedidos.length === 0) {
    return <h2>Nenhum pedido ainda</h2>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Meus Pedidos</h1>

      {pedidos.map((pedido, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            marginBottom: 20,
            padding: 20
          }}
        >
          <h3>{pedido.nome}</h3>

          {pedido.imagem && (
            <img
              src={pedido.imagem}
              alt={pedido.nome}
              style={{ width: 150 }}
            />
          )}

          <p>Quantidade: {pedido.quantidade}</p>

          <p>
            Total: R$ {Number(pedido.preco * pedido.quantidade).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}