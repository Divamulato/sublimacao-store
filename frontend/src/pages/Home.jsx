import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Home.css";

const API = "https://sublimacao-store.onrender.com";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const res = await fetch(`${API}/produtos`);
        const data = await res.json();

        setProdutos(data.slice(0, 4));
      } catch (error) {
        console.log(
          "Erro ao carregar produtos:",
          error
        );
      }
    }

    async function registrarVisita() {
      try {
        const visitou =
          localStorage.getItem("visitouSite");

        if (!visitou) {
          await fetch(`${API}/visitas`, {
            method: "POST",
          });

          localStorage.setItem(
            "visitouSite",
            "sim"
          );
        }
      } catch (error) {
        console.log(
          "Erro ao registrar visita:",
          error
        );
      }
    }

    async function carregarVisitas() {
      try {
        const res = await fetch(`${API}/visitas`);
        const data = await res.json();

        setVisitas(data.total || 0);
      } catch (error) {
        console.log(
          "Erro ao carregar visitas:",
          error
        );
      }
    }

    carregarProdutos();
    registrarVisita();
    carregarVisitas();
  }, []);

  return (
    <>
      <Navbar />

      <section className="hero">
        <h1>DIVA SUBLIMAÇÃO</h1>

        <p>
          Produtos personalizados com acabamento premium.
        </p>

        <Link
          to="/produtos"
          className="btnHero"
        >
          Ver Produtos
        </Link>

        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          👁️ {visitas} visitas
        </p>
      </section>

      <section className="categorias">
        <div className="categoria">
          ☕ Canecas
        </div>

        <div className="categoria">
          👕 Camisetas
        </div>

        <div className="categoria">
          🖼️ Azulejos
        </div>

        <div className="categoria">
          🎁 Personalizados
        </div>
      </section>

      <section className="destaques">
        <h2 className="tituloDestaques">
          Produtos em Destaque
        </h2>

        <div className="gridDestaques">
          {produtos.length === 0 ? (
            <p style={{ color: "white" }}>
              Nenhum produto encontrado.
            </p>
          ) : (
            produtos.map((produto) => (
              <div
                key={produto.id}
                className="cardDestaque"
              >
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

                <h3>{produto.nome}</h3>

                <span>
                  R${" "}
                  {Number(
                    produto.preco
                  ).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        <Link
          to="/produtos"
          className="btnVerTodos"
        >
          Ver Todos os Produtos
        </Link>
      </section>

      <Footer />
    </>
  );
}