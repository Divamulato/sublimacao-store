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

    mensagem +=
  `Pedido Nº ${pedidoId}%0A%0A`;

    mensagem += "Itens:%0A";

    carrinho.forEach(item => {

      mensagem +=
        `${item.nome} x${item.quantidade}%0A`;

        

    });

   window.open(
  `https://wa.me/5511984644381?text=${mensagem}`,
  "_blank"
);

setTimeout(() => {
  alert(
    "Pedido enviado com sucesso! Obrigado pela preferência."
  );

  localStorage.removeItem("carrinho");
  localStorage.removeItem("cliente");
  localStorage.removeItem("pedidoId");

  navigate("/");
}, 500);
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