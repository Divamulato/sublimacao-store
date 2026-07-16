import { useNavigate } from "react-router-dom";

export default function Confirmacao() {
  const navigate = useNavigate();

  function enviarWhats() {
    const pedido =
      JSON.parse(
        localStorage.getItem("pedidoAtual")
      ) || {};

    const cliente =
      JSON.parse(
        localStorage.getItem("cliente")
      ) || {};

    const pedidoId =
      localStorage.getItem("pedidoId");

    const itens = pedido.itens || [];

    let mensagem =
      `Olá Diva, realizei o pagamento.%0A%0A`;

    mensagem +=
      `Nome: ${cliente.nome}%0A`;

    mensagem +=
      `WhatsApp: ${cliente.telefone}%0A`;

    if (cliente.endereco) {
      mensagem +=
        `Endereço: ${cliente.endereco}%0A`;
    }

    mensagem += `%0A`;

    mensagem +=
      `Pedido Nº ${pedidoId}%0A%0A`;

    mensagem +=
      "Itens:%0A";

    itens.forEach((item) => {
      mensagem +=
        `• ${item.nome}%0A`;

      mensagem +=
        `Qtd: ${item.quantidade}%0A`;

      mensagem +=
        `Valor: R$ ${Number(item.preco).toFixed(2)}%0A%0A`;
    });

    mensagem +=
      `Total: R$ ${Number(
        pedido.total || 0
      ).toFixed(2)}%0A`;

    window.open(
      `https://wa.me/5511984644381?text=${mensagem}`,
      "_blank"
    );

    setTimeout(() => {
      alert(
        "Pedido enviado com sucesso! Obrigado pela preferência."
      );

      localStorage.removeItem("pedidoAtual");
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
        color: "#000",
      }}
    >
      <h1>Pagamento Informado</h1>

      <p>
        Agora envie seu pedido pelo
        WhatsApp.
      </p>

      <button onClick={enviarWhats}>
        Enviar Pedido
      </button>
    </div>
  );
}