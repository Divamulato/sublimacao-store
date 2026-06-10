import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  async function continuar() {
    const carrinho =
      JSON.parse(localStorage.getItem("carrinho")) || [];

    if (!carrinho.length) {
      alert("Seu carrinho está vazio");
      navigate("/carrinho");
      return;
    }

    if (!nome || !telefone || !endereco) {
      alert("Preencha nome, telefone e endereço");
      return;
    }

    const total = carrinho.reduce(
      (acc, item) =>
        acc + Number(item.preco) * item.quantidade,
      0
    );

    setLoading(true);

    try {
      const res = await fetch(
        "https://sublimacao-store.onrender.com/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itens: carrinho,
            total,
            cliente: nome,
            endereco,
            telefone,
            observacao,
            status: "pendente",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao criar pedido");
      }

      // salva dados do pedido
      localStorage.setItem("cliente", JSON.stringify({
        nome,
        telefone,
        endereco,
        observacao,
      }));

      localStorage.setItem("pedidoId", data.id);

      console.log("PEDIDO CRIADO:", data);

      // 🔥 NÃO limpar carrinho aqui (IMPORTANTE)
      // carrinho só será limpo no PIX ou pagamento aprovado

      navigate("/pix");

    } catch (err) {
      console.error("ERRO CHECKOUT:", err);
      alert("Erro ao criar pedido. Tente novamente.");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
        color: "#000",
      }}
    >
      <button onClick={() => navigate("/carrinho")}>
        ← Voltar ao carrinho
      </button>

      <h1>Finalizar Pedido</h1>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="WhatsApp"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Observações"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
      />

      <br /><br />

      <button
        onClick={continuar}
        disabled={loading}
        style={{
          padding: "12px 25px",
          fontSize: "18px",
        }}
      >
        {loading ? "Criando pedido..." : "Continuar para PIX"}
      </button>
    </div>
  );
}