import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./produtos.css";

export default function Produtos() {

  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function buscarProdutos() {

      try {

        const res = await fetch(
          "https://sublimacao-store.onrender.com/produtos"
        );

        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("DADOS:", data);
        console.log("ARRAY:", Array.isArray(data));

        setProdutos(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Erro ao carregar produtos:",
          error
        );

        setProdutos([]);

      } finally {

        setLoading(false);

      }

    }

    buscarProdutos();

  }, []);

  const produtosFiltrados = Array.isArray(produtos)
    ? produtos.filter((produto) =>
        (produto?.nome ?? "")
          .toLowerCase()
          .includes(busca.toLowerCase())
      )
    : [];

  function adicionarAoCarrinho(produto) {

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

    navigate("/carrinho");
  }

  return (
    <>
      <Navbar />

      <div className="paginaProdutos">

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          <button
            className="btnVoltar"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>

          <button
            className="btnCarrinho"
            onClick={() => navigate("/carrinho")}
          >
            🛒 Carrinho
          </button>
        </div>

        <h1 className="tituloPagina">
          🛍️ Nossos Produtos
        </h1>

        <input
          type="text"
          placeholder="Buscar produto..."
          className="campoBusca"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {loading ? (

          <p className="loading">
            Carregando produtos...
          </p>

        ) : (

          <div className="gridProdutos">

            {produtosFiltrados.map((produto) => (

              <div
                className="cardProduto"
                key={produto.id}
              >

                <div className="imagemProduto">

                  {produto.imagem ? (

                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                    />

                  ) : (

                    <div className="semImagem">
                      Sem imagem
                    </div>

                  )}

                </div>

                <h3>
                  {produto.nome}
                </h3>

                <p>
                  {produto.descricao}
                </p>

                <span className="preco">
                  R$ {Number(produto.preco).toFixed(2)}
                </span>

                <br />
                <br />

                <button
                  className="btnComprar"
                  onClick={() =>
                    navigate(`/produto/${produto.id}`)
                  }
                >
                  Ver Produto
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}