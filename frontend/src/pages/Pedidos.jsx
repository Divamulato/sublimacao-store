import { useEffect, useState } from "react";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const dados =
      JSON.parse(localStorage.getItem("pedidos")) || [];

    console.log("PEDIDOS:", dados);

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
            borderRadius: 10,
            padding: 20,
            marginBottom: 20
          }}
        >
          <h3>Pedido #{pedido.id}</h3>

          <p>
            <strong>Cliente:</strong>{" "}
            {pedido.cliente}
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
              pedido.data
            ).toLocaleString()}
          </p>

          <hr />

          <h4>Itens:</h4>

          {pedido.itens?.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: 25,
                padding: 15,
                border: "1px solid #eee",
                borderRadius: 8
              }}
            >
              <h3>{item.nome}</h3>

              <p>
                Quantidade: {item.quantidade}
              </p>

              <p>
                Preço: R${" "}
                {Number(item.preco).toFixed(2)}
              </p>

              {/* FOTO DO PRODUTO */}
              {item.imagem && (
                <>
                  <p>
                    <strong>Produto:</strong>
                  </p>

                  <img
                    src={item.imagem}
                    alt={item.nome}
                    style={{
                      width: 150,
                      borderRadius: 8,
                      display: "block",
                      marginBottom: 15
                    }}
                  />
                </>
              )}
              console.log(
  "fotoCliente:",
  item.fotoCliente
);

console.log(
  "tamanho:",
  item.fotoCliente?.length
);

              {/* FOTO ENVIADA PELO CLIENTE */}
             {item.fotoCliente && (
  <img
    src={item.fotoCliente}
    alt="Arte do cliente"
    style={{
      width: 200,
      border: "3px solid red",
      borderRadius: 10
    }}
    onLoad={() =>
      console.log(
        "IMAGEM CARREGOU:",
        item.fotoCliente
      )
    }
    onError={() =>
      console.log(
        "ERRO AO CARREGAR:",
        item.fotoCliente
      )
    }
  />
)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}