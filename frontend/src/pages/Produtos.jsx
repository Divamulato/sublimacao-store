import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Produtos.css";

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

        console.log("PRODUTOS API:", data);

        setProdutos(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    buscarProdutos();

  }, []);

  /* =========================
     🔥 FILTRO SEGURO
  ========================= */
  const produtosFiltrados = produtos.filter((produto) =>
    (produto?.nome ?? "")
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="paginaProdutos">

        <button
          className="btnVoltar"
          onClick={() => navigate(-1)}
        >
          ← Voltar
        </button>

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
                key={produto?.id}
              >

                <div className="imagemProduto">

                  {produto?.imagem ? (
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
                  {produto?.nome ?? "Sem nome"}
                </h3>

                <p>
                  {produto?.descricao ?? "Sem descrição"}
                </p>

                <span className="preco">
                  R$ {Number(produto?.preco || 0).toFixed(2)}
                </span>

                <button className="btnComprar">
                  Comprar
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