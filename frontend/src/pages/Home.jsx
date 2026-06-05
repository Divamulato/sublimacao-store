import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./home.css";

export default function Home() {

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

      <Footer />
    </>
  );
}