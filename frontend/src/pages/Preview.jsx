import { useLocation, useNavigate } from "react-router-dom";
import "./Preview.css";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const produto = location.state?.produto;
  const fotoCliente = location.state?.fotoCliente;

  if (!produto) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Produto não encontrado</h2>

        <button
          onClick={() => navigate("/produtos")}
        >
          Voltar aos Produtos
        </button>
      </div>
    );
  }

  function irParaCheckout() {
    navigate("/checkout", {
      state: {
        produto,
        fotoCliente
      }
    });
  }

  return (
    <div className="previewPage">
      <h1>Personalize sua Caneca</h1>

      <p>
        Confira como sua arte ficará no
        produto.
      </p>

      <div className="previewContainer">
        {fotoCliente && (
          <>
            <img
              src={fotoCliente}
              alt="Arte"
              className="arteCliente"
            />

            <div className="sombraArte" />

            <div className="reflexoArte" />
          </>
        )}

        <img
          src="/mockups/caneca-branca.png"
          alt="Caneca"
          className="mockup"
        />
      </div>

      {!fotoCliente && (
        <p style={{ color: "#ff6600" }}>
          Nenhuma arte enviada.
        </p>
      )}

      <h3>
        Valor: R$
        {Number(produto.preco).toFixed(2)}
      </h3>

      <div className="previewButtons">
        <button
          onClick={() => navigate(-1)}
        >
          Alterar Foto
        </button>

        <button
          onClick={irParaCheckout}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}