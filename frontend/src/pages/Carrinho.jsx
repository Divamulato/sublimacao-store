import { useEffect, useState } from "react";

export default function Carrinho() {

  const [itens, setItens] = useState([]);

  useEffect(() => {

    const carrinho =
      JSON.parse(localStorage.getItem("carrinho")) || [];

    setItens(carrinho);

  }, []);

  function salvarCarrinho(novoCarrinho) {

    setItens(novoCarrinho);

    localStorage.setItem(
      "carrinho",
      JSON.stringify(novoCarrinho)
    );
  }

  function aumentar(id) {

    const novoCarrinho = itens.map(item =>
      item.id === id
        ? {
            ...item,
            quantidade: item.quantidade + 1
          }
        : item
    );

    salvarCarrinho(novoCarrinho);
  }

  function diminuir(id) {

    const novoCarrinho = itens
      .map(item =>
        item.id === id
          ? {
              ...item,
              quantidade: item.quantidade - 1
            }
          : item
      )
      .filter(item => item.quantidade > 0);

    salvarCarrinho(novoCarrinho);
  }

  function remover(id) {

    const novoCarrinho =
      itens.filter(item => item.id !== id);

    salvarCarrinho(novoCarrinho);
  }

  const total = itens.reduce(
    (acc, item) =>
      acc +
      Number(item.preco) *
      item.quantidade,
    0
  );

  return (
    <div
      style={{
        padding: "40px",
        background: "#fff",
        color: "#000",
        minHeight: "100vh"
      }}
    >
      <h1>🛒 Carrinho</h1>

      {itens.length === 0 ? (

        <p>Seu carrinho está vazio.</p>

      ) : (

        <>
          {itens.map(item => (

            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px"
              }}
            >

              {item.imagem && (
                <img
                  src={item.imagem}
                  alt={item.nome}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover"
                  }}
                />
              )}

              <h3>{item.nome}</h3>

              <p>{item.descricao}</p>

              <strong>
                R$ {Number(item.preco).toFixed(2)}
              </strong>

              <br />
              <br />

              <button
                onClick={() => diminuir(item.id)}
              >
                -
              </button>

              <span
                style={{
                  margin: "0 15px",
                  fontWeight: "bold"
                }}
              >
                {item.quantidade}
              </span>

              <button
                onClick={() => aumentar(item.id)}
              >
                +
              </button>

              <button
                style={{
                  marginLeft: "20px"
                }}
                onClick={() => remover(item.id)}
              >
                Remover
              </button>

            </div>

          ))}

          <hr />

          <h2>
            Total: R$ {total.toFixed(2)}
          </h2>

          <button
            style={{
              padding: "12px 25px",
              fontSize: "18px"
            }}
          >
            Finalizar Compra
          </button>
        </>
      )}

    </div>
  );
}