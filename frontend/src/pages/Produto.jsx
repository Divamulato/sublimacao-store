import Produto from "../pages/Produto";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API =
  "https://sublimacao-store.onrender.com";

export default function Produto() {

  const { id } = useParams();

  const [produto, setProduto] =
    useState(null);

  useEffect(() => {

    async function carregar() {

      const res =
        await fetch(`${API}/produtos`);

      const data =
        await res.json();

      const encontrado =
        data.find(
          p => p.id === Number(id)
        );

      setProduto(encontrado);
    }

    carregar();

  }, [id]);

  if (!produto)
    return <h2>Carregando...</h2>;

  function adicionarCarrinho() {

    let carrinho =
      JSON.parse(
        localStorage.getItem(
          "carrinho"
        )
      ) || [];

    const existe =
      carrinho.find(
        item => item.id === produto.id
      );

    if (existe) {

      existe.quantidade += 1;

    } else {

      carrinho.push({
        ...produto,
        quantidade: 1
      });

    }

    localStorage.setItem(
      "carrinho",
      JSON.stringify(carrinho)
    );

    alert("Produto adicionado!");
  }

  return (
    <div
      style={{
        padding: "40px",
        color: "#000"
      }}
    >

      <h1>{produto.nome}</h1>

      {produto.imagem && (
        <img
          src={produto.imagem}
          alt={produto.nome}
          style={{
            width: "400px",
            maxWidth: "100%",
            borderRadius: "10px"
          }}
        />
      )}

      <p>
        {produto.descricao}
      </p>

      <h2>
        R$
        {Number(
          produto.preco
        ).toFixed(2)}
      </h2>

      <button
        onClick={adicionarCarrinho}
      >
        Adicionar ao Carrinho
      </button>

    </div>
  );
}