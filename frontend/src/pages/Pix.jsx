import { useNavigate } from "react-router-dom";

export default function Pix() {
  const navigate = useNavigate();

  const chavePix =
    "00020126400014br.gov.bcb.pix0111278285678200203Pix5204000053039865802BR5921SERGIO_FERREIRA_GRACA6009SAO_PAULO62120508Sublimao630408DE";

  const pedido =
    JSON.parse(
      localStorage.getItem(
        "pedidoAtual"
      )
    ) || {};

  const pedidoId =
    pedido.id || "-";

  const total =
    Number(pedido.total) || 0;

  function copiarPix() {
    navigator.clipboard.writeText(
      chavePix
    );

    alert(
      "PIX copiado com sucesso!"
    );
  }

  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        color: "#000"
      }}
    >
      <button
        onClick={() =>
          navigate(-1)
        }
      >
        ← Voltar
      </button>

      <button
        onClick={copiarPix}
        style={{
          marginLeft: 10
        }}
      >
        Copiar PIX
      </button>

      <h1>Pagamento PIX</h1>

      <h2>
        Total: R$
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
        PIX Copia e Cola:
      </strong>

      <p
        style={{
          wordBreak:
            "break-all",
          maxWidth: 600,
          margin:
            "20px auto"
        }}
      >
        {chavePix}
      </p>

      <p>
        Escaneie o QR Code
        ou copie o código PIX
        acima e realize o
        pagamento.
      </p>

      <button
        onClick={() =>
          navigate(
            "/confirmacao"
          )
        }
      >
        Já Realizei o Pagamento
      </button>
    </div>
  );
}