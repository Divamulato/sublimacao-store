import { useNavigate } from "react-router-dom";

export default function Pix() {

  const navigate = useNavigate();

  const carrinho =
    JSON.parse(localStorage.getItem("carrinho")) || [];

  const total = carrinho.reduce(
    (acc, item) =>
      acc + Number(item.preco) * item.quantidade,
    0
  );

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        color: "#000"
      }}
    >

      <button
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1>Pagamento PIX</h1>

      <h2>
        Total: R$ {total.toFixed(2)}
      </h2>

      <br />

      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PIX"
        alt="QR Code PIX"
      />

      <br />
      <br />

      <strong>
        Chave PIX:
      </strong>

      <p>
        27828567820
      </p>

      <button
        onClick={() =>
          navigate("/confirmacao")
        }
      >
        Já Realizei o Pagamento
      </button>

    </div>
  );
}