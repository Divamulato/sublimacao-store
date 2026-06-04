import { useEffect, useState } from "react";
import "./produtos.css";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const res = await fetch("http://localhost:3001/produtos");
        const data = await res.json();
        setProdutos(data);
      } catch (error) {
        console.log("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarProdutos();
  }, []);

  return (
    <div className="container">
      <h1 className="titulo">🛍️ Nossos Produtos</h1>

      {loading ? (
        <p className="loading">Carregando produtos...</p>
      ) : (
        <div className="grid">
          {produtos.map((p) => (
            <div className="card" key={p.id}>
              
              <div className="image">
                {p.imagem ? (
                  <img src={p.imagem} alt={p.nome} />
                ) : (
                  <div className="placeholder">Sem imagem</div>
                )}
              </div>

              <div className="info">
                <h3>{p.nome}</h3>
                <p className="descricao">
                  {p.descricao || "Sem descrição disponível"}
                </p>

                <div className="footer">
                  <span className="preco">
                    R$ {Number(p.preco).toFixed(2)}
                  </span>

                  <button className="btn">Comprar</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}