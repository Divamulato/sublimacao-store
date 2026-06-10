import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://sublimacao-store.onrender.com";

export default function Carrinho() {
  const navigate = useNavigate();
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const carrinho =
      JSON.parse(localStorage.getItem("carrinho")) || [];

    setItens(carrinho);
  }, []);

  function salvarCarrinho(novoCarrinho) {
    localStorage.setItem(
      "carrinho",
      JSON.stringify(novoCarrinho)
    );

    setItens([...novoCarrinho]);
  }

  function aumentar(id) {
    const novoCarrinho = itens.map(item =>
      item.id === id
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );

    salvarCarrinho(novoCarrinho);
  }

  function diminuir(id) {
    const novoCarrinho = itens
      .map(item =>
        item.id === id
          ? { ...item, quantidade: item.quantidade - 1 }
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
      acc + Number(item.preco) * item.quantidade,
    0
  );

  // 🔥 CHECKOUT REAL
  async function finalizarCompra() {
    if (itens.length === 0) {
      alert("Carrinho vazio");
      return;
    }

    const total = itens.reduce(
      (acc, item) =>
        acc + Number(item.preco) * item.quantidade,
      0
    );

    try {
      const res = await fetch(`${API}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itens,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao finalizar compra");
      }

      alert("Pedido realizado com sucesso!");

     

      navigate("/");
    } catch (error) {
      console.error("ERRO CHECKOUT:", error);
      alert("Erro ao finalizar compra");
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        background: "#fff",
        color: "#000",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          border: "none",
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

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
                borderRadius: "10px",
              }}
            >
              <img
                src={
                  item.fotoCliente
                    ? item.fotoCliente
                    : item.imagem
                }
                alt={item.nome}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              {item.fotoCliente && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  ✓ Arte enviada pelo cliente
                </p>
              )}

              <h3>{item.nome}</h3>

              <p>{item.descricao}</p>

              <strong>
                R$ {Number(item.preco).toFixed(2)}
              </strong>

              <br />
              <br />

              <button onClick={() => diminuir(item.id)}>
                -
              </button>

              <span style={{ margin: "0 15px" }}>
                {item.quantidade}
              </span>

              <button onClick={() => aumentar(item.id)}>
                +
              </button>

              <button
                style={{ marginLeft: "20px" }}
                onClick={() => remover(item.id)}
              >
                Remover
              </button>
            </div>
          ))}

          <hr />

          <h2>Total: R$ {total.toFixed(2)}</h2>

          {/* 🔥 NOVO BOTÃO REAL */}
          <button
            onClick={finalizarCompra}
            style={{
              padding: "12px 25px",
              fontSize: "18px",
              background: "green",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
}