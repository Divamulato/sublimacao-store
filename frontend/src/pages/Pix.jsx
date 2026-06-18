import { useNavigate } from "react-router-dom";

export default function Pix() {
  const navigate = useNavigate();

  const chavePix = "27828567820";

  const pedido =
    JSON.parse(
      localStorage.getItem("pedidoAtual")
    ) || {};

  const pedidoId = pedido.id;
  const total = Number(pedido.total) || 0;

  function copiarChave() {
    navigator.clipboard.writeText(
      chavePix
    );

    alert("Chave PIX copiada!");
  }

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
        onClick={copiarChave}
        style={{
          marginLeft: 10
        }}
      >
        Copiar Chave PIX CPF
      </button>

      <h1>Pagamento PIX</h1>

      <h2>
        Total: R${" "}
        {total.toFixed(2)}
      </h2>

      <h3>
        Pedido Nº {pedidoId}
      </h3>

      <br />

      <img
        src="/qrcode-pix.png"
        alt="QR Code PIX"
        style={{
          width: 250,
          borderRadius: 10
        }}
      />

      <br />
      <br />

      <strong>
        Chave PIX:
      </strong>

      <p>{chavePix}</p>

      <p
        style={{
          maxWidth: 500,
          margin: "20px auto"
        }}
      >
        Escaneie o QR Code ou copie
        a chave PIX acima e realize
        o pagamento referente ao
        pedido.
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