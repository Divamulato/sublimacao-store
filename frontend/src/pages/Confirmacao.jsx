import { useNavigate } from "react-router-dom";

export default function Confirmacao() {

  const navigate = useNavigate();

  function enviarWhats() {

    const carrinho =
      JSON.parse(
        localStorage.getItem("carrinho")
      ) || [];

    const cliente =
      JSON.parse(
        localStorage.getItem("cliente")
      ) || {};

    let mensagem =
      `Olá Diva, realizei o pagamento.%0A%0A`;

    mensagem +=
      `Nome: ${cliente.nome}%0A`;

    mensagem +=
      `WhatsApp: ${cliente.telefone}%0A%0A`;

    mensagem += "Pedido:%0A";

    carrinho.forEach(item => {

      mensagem +=
        `${item.nome} x${item.quantidade}%0A`;

    });

    window.open(
      `https://wa.me/5511984644381?text=${mensagem}`,
      "_blank"
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        color: "#000"
      }}
    >
      <h1>
        Pagamento Informado
      </h1>

      <p>
        Agora envie seu pedido
        pelo WhatsApp.
      </p>

      <button
        onClick={enviarWhats}
      >
        Enviar Pedido
      </button>
    </div>
  );
}