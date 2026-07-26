import { useNavigate } from "react-router-dom";

export default function Confirmacao() {
const navigate = useNavigate();

// Recupera o número do pedido para ser usado
// tanto na tela quanto na mensagem do WhatsApp
const pedidoId =
localStorage.getItem("pedidoId") || "";

function enviarWhats() {
const pedido =
JSON.parse(
localStorage.getItem("pedidoAtual") || "{}"
);

const cliente =
  JSON.parse(
    localStorage.getItem("cliente") || "{}"
  );

const itens = Array.isArray(pedido.itens)
  ? pedido.itens
  : [];

let mensagem =
  "Olá Diva, realizei o pagamento.%0A%0A";

mensagem +=
  `Nome: ${cliente.nome || ""}%0A`;

mensagem +=
  `WhatsApp: ${cliente.telefone || ""}%0A`;

if (cliente.endereco) {
  mensagem +=
    `Endereço: ${cliente.endereco}%0A`;
}

mensagem += "%0A";

mensagem +=
  `Pedido Nº ${pedidoId}%0A%0A`;

mensagem += "Itens:%0A";

itens.forEach((item) => {
  mensagem +=
    `• ${item.nome || "Produto"}%0A`;

  mensagem +=
    `Qtd: ${item.quantidade || 1}%0A`;

  mensagem +=
    `Valor: R$ ${Number(
      item.preco || 0
    ).toFixed(2)}%0A%0A`;
});

mensagem +=
  `Total: R$ ${Number(
    pedido.total || 0
  ).toFixed(2)}%0A`;

const urlWhatsApp =
  `https://wa.me/5511984644381?text=${mensagem}`;

window.open(
  urlWhatsApp,
  "_blank"
);

alert(
  "Pedido enviado com sucesso! Obrigado pela preferência."
);

// Limpa os dados depois do envio
localStorage.removeItem(
  "pedidoAtual"
);

localStorage.removeItem(
  "cliente"
);

localStorage.removeItem(
  "pedidoId"
);

navigate("/");


}

return (
<div
style={{
minHeight: "100vh",
padding: "40px 20px",
background: "#f7f7f7",
color: "#000",
display: "flex",
justifyContent: "center",
alignItems: "center",
boxSizing: "border-box",
}}
>
<div
style={{
width: "100%",
maxWidth: "600px",
background: "#fff",
padding: "40px 25px",
borderRadius: "16px",
textAlign: "center",
boxShadow:
"0 5px 25px rgba(0, 0, 0, 0.10)",
boxSizing: "border-box",
}}
>
<div
style={{
fontSize: "60px",
marginBottom: "15px",
}}
>
✅ </div>

```
    <h1>
      Pedido realizado com sucesso!
    </h1>

    {pedidoId && (
      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          margin: "20px 0",
        }}
      >
        Pedido Nº {pedidoId}
      </p>
    )}

    <p
      style={{
        fontSize: "18px",
        lineHeight: "1.6",
      }}
    >
      Seu pedido foi registrado
      com sucesso.
    </p>

    <p
      style={{
        fontSize: "17px",
        lineHeight: "1.6",
      }}
    >
      Para concluir seu atendimento,
      envie a confirmação do pagamento
      pelo WhatsApp.
    </p>

    <button
      onClick={enviarWhats}
      style={{
        width: "100%",
        maxWidth: "400px",
        marginTop: "20px",
        padding: "14px 20px",
        fontSize: "17px",
        fontWeight: "bold",
        background: "#25D366",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      📱 Enviar confirmação pelo WhatsApp
    </button>

    <button
      onClick={() => navigate("/")}
      style={{
        width: "100%",
        maxWidth: "400px",
        marginTop: "15px",
        padding: "12px 20px",
        fontSize: "16px",
        background: "#eee",
        color: "#333",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      🏠 Voltar para a loja
    </button>
  </div>
</div>


);
}
