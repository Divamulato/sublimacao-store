import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://sublimacao-store.onrender.com";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${API}/produtos/${id}`);
        const data = await res.json();

        setProduto(data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    }

    carregar();
  }, [id]);

  function adicionarAoCarrinho() {
    let carrinho =
      JSON.parse(localStorage.getItem("carrinho")) || [];

    const existente = carrinho.find(
      item => item.id === produto.id
    );

    if (existente) {
      existente.quantidade += 1;
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

    navigate("/carrinho", {
      state: {
        from: `/produto/${produto.id}`
      }
    });
  }

  // 🔥 NOVO: IR PARA PREVIEW
 function irParaPreview() {
  navigate("/preview", {
    state: {
      produto,
      fotoCliente:
        produto.fotoCliente ||
        localStorage.getItem("fotoCliente") ||
        null
    }
  });
}

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

      <h1>{produto.nome}</h1>

      <p>{produto.descricao}</p>

      <h2>
        R$ {Number(produto.preco).toFixed(2)}
      </h2>

     <div style={{ display: "flex", gap: "10px" }}>
  <button onClick={adicionarAoCarrinho}>
    Adicionar ao Carrinho
  </button>

  <button onClick={irParaPreview}>
    Personalizar Produto
  </button>
</div>
    </div>
  );
}