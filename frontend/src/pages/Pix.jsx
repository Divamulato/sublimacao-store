import { useNavigate } from "react-router-dom";

export default function Pix() {

    const chavePix =
  "27828567820";

  const navigate = useNavigate();

 const pedidoId = localStorage.getItem("pedidoId");

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

      <button
  onClick={() => {
    navigator.clipboard.writeText(
      chavePix
    );

    alert("Chave PIX copiada!");
  }}
>
  Copiar Chave PIX CPF
</button>

      <h1>Pagamento PIX</h1>

      <h2>
        Total: R$ {total.toFixed(2)}
      </h2>
      <h3>
        Pedido Nº {pedidoId}
      </h3>
      <br />

      <img
        src="/qrcode-pix.png"
        alt="QR Code PIX"
        style={{
    width: "250px"
  }}
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