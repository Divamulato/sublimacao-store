import { useEffect, useState } from "react";

export default function Carrinho() {

  const [itens, setItens] = useState([]);

  useEffect(() => {

    const carrinho =
      JSON.parse(localStorage.getItem("carrinho")) || [];

    setItens(carrinho);

  }, []);

  function removerItem(index) {

    const novoCarrinho = [...itens];

    novoCarrinho.splice(index, 1);

    setItens(novoCarrinho);

    localStorage.setItem(
      "carrinho",
      JSON.stringify(novoCarrinho)
    );
  }

  const total = itens.reduce(
    (acc, item) => acc + Number(item.preco),
    0
  );

  return (
    <div
      style={{
        padding: "40px",
        color: "#000",
        background: "#fff",
        minHeight: "100vh"
      }}
    >
      <h1>🛒 Carrinho</h1>

      {itens.length === 0 ? (

        <p>Seu carrinho está vazio.</p>

      ) : (

        <>
          {itens.map((item, index) => (

            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px"
              }}
            >
              <h3>{item.nome}</h3>

              <p>{item.descricao}</p>

              <strong>
                R$ {Number(item.preco).toFixed(2)}
              </strong>

              <br /><br />

              <button
                onClick={() =>
                  removerItem(index)
                }
              >
                Remover
              </button>
            </div>

          ))}

          <hr />

          <h2>
            Total: R$ {total.toFixed(2)}
          </h2>
        </>
      )}

    </div>
  );
}