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

        <button onClick={() => navigate("/produtos")}>
          Voltar aos Produtos
        </button>
      </div>
    );
  }

  function irParaCheckout() {
    navigate("/checkout", {
      state: {
        produto,
        fotoCliente,
      },
    });
  }

  return (
    <div className="previewPage">
      <h1>Personalize sua Caneca</h1>
      <p>Confira como sua arte ficará no produto.</p>

      {/* LAYOUT PROFISSIONAL */}
      <div className="previewLayout">

        {/* COLUNA ESQUERDA - CONTROLES */}
        <div className="previewLeft">

          <h2>Sua arte</h2>

          {/* AQUI ENTRA SEU UPLOAD (ou preview da imagem enviada) */}
          {fotoCliente ? (
            <img
              src={fotoCliente}
              alt="Upload"
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 15
              }}
            />
          ) : (
            <p style={{ color: "#ff6600" }}>
              Nenhuma arte enviada.
            </p>
          )}

          <button onClick={() => navigate(-1)}>
            Alterar Foto
          </button>

          <button onClick={irParaCheckout}>
            Adicionar ao Carrinho
          </button>

        </div>

        {/* COLUNA DIREITA - PREVIEW MOCKUP */}
        <div className="previewRight">

          <div className="previewContainer">

            <img
              src="/mockups/caneca-branca.png"
              alt="Caneca"
              className="mockup"
            />

            {fotoCliente && (
              <div className="arteContainer">
                <img
                  src={fotoCliente}
                  alt="Arte do cliente"
                  className="arteCliente"
                />

                <div className="sombraArte" />
                <div className="reflexoArte" />
              </div>
            )}

          </div>

          <h3>
            Valor: R$ {Number(produto.preco).toFixed(2)}
          </h3>

        </div>

      </div>
    </div>
  );
}