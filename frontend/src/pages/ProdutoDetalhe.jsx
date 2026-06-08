import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "https://sublimacao-store.onrender.com";

export default function ProdutoDetalhe() {

  const { id } = useParams();

  const [produto, setProduto] = useState(null);

  useEffect(() => {

    async function carregar() {

      const res = await fetch(`${API}/produtos`);

      const data = await res.json();

      const encontrado = data.find(
        p => p.id === Number(id)
      );

      setProduto(encontrado);

    }

    carregar();

  }, [id]);

  if (!produto) {
    return <h2>Carregando...</h2>;
  }

  return (
    <div
      style={{
        padding: "40px",
        color: "#000",
        background: "#fff",
        minHeight: "100vh"
      }}
    >
      <img
        src={produto.imagem}
        alt={produto.nome}
        style={{
          width: "400px",
          maxWidth: "100%"
        }}
      />

      <h1>{produto.nome}</h1>

      <p>{produto.descricao}</p>

      <h2>
        R$ {Number(produto.preco).toFixed(2)}
      </h2>

      <button>
        Adicionar ao Carrinho
      </button>
    </div>
  );
}