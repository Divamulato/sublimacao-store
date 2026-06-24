import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Preview.css";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const produto = location.state?.produto;
  const fotoCliente = location.state?.fotoCliente;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [zoom, setZoom] = useState(100);

  if (!produto) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Produto não encontrado</h2>

        <button
          onClick={() =>
            navigate("/produtos")
          }
        >
          Voltar
        </button>
      </div>
    );
  }

  function adicionarCarrinho() {
    const carrinho =
      JSON.parse(
        localStorage.getItem("carrinho")
      ) || [];

    carrinho.push({
      ...produto,
      quantidade: 1,
      fotoCliente,
      arteX: x,
      arteY: y,
      arteZoom: zoom,
    });

    localStorage.setItem(
      "carrinho",
      JSON.stringify(carrinho)
    );

    navigate("/carrinho");
  }

  return (
    <div className="previewPage">

      <button
        className="btnVoltar"
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1>{produto.nome}</h1>

      <p>
        Personalize sua caneca com sua arte
      </p>

      <div className="previewCard">

        <div className="previewContainer">

          <img
            src="/mockups/caneca-branca.png"
            alt="Caneca"
            className="mockup"
          />

          {fotoCliente && (
            <div
              className="arteContainer"
              style={{
                transform: `
                  translate(${x}px, ${y}px)
                  scale(${zoom / 100})
                `,
              }}
            >
              <img
                src={fotoCliente}
                alt="Arte"
                className="arteCliente"
              />
            </div>
          )}

        </div>

        <div className="editorPanel">

          <div className="editorBox">
            <h3>Sua arte</h3>

            <img
              src={fotoCliente}
              alt=""
              className="miniArte"
            />
          </div>

          <div className="editorBox">
            <h3>Posição da arte</h3>

            <div className="setas">

              <button
                onClick={() =>
                  setY(y - 10)
                }
              >
                ↑
              </button>

              <button
                onClick={() =>
                  setX(x - 10)
                }
              >
                ←
              </button>

              <button
                onClick={() =>
                  setX(x + 10)
                }
              >
                →
              </button>

              <button
                onClick={() =>
                  setY(y + 10)
                }
              >
                ↓
              </button>

            </div>
          </div>

          <div className="editorBox">
            <h3>Tamanho</h3>

            <input
              type="range"
              min="50"
              max="150"
              value={zoom}
              onChange={(e) =>
                setZoom(
                  Number(e.target.value)
                )
              }
            />

            <span>{zoom}%</span>
          </div>

        </div>

      </div>

      <div className="rodapePreview">

        <h2>
          R$
          {Number(
            produto.preco
          ).toFixed(2)}
        </h2>

        <div>

          <button
            onClick={() =>
              navigate(-1)
            }
          >
            Alterar Arte
          </button>

          <button
            className="btnComprar"
            onClick={
              adicionarCarrinho
            }
          >
            Adicionar ao Carrinho
          </button>

        </div>

      </div>

    </div>
  );
}