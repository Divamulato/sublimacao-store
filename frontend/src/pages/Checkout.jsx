import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {

  console.log("CHEGOU AQUI: PIX");
  
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  async function continuar() {
  if (loading) return;

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (!carrinho.length) {
    alert("Carrinho vazio");
    return;
  }

  if (!nome || !telefone || !endereco) {
    alert("Preencha todos os dados");
    return;
  }

  const total = carrinho.reduce(
    (acc, item) => acc + Number(item.preco) * item.quantidade,
    0
  );

  setLoading(true);

  try {
    const res = await fetch(
      "https://sublimacao-store.onrender.com/pedidos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itens: carrinho,
          total,
          cliente: nome,
          telefone,
          endereco,
          observacao,
          status: "pendente",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Erro ao criar pedido");
    }

    const pedidoId = data.id || data.pedido?.id;

    if (!pedidoId) {
      throw new Error("Pedido sem ID");
    }

    localStorage.setItem("pedidoId", pedidoId);
    localStorage.setItem(
      "cliente",
      JSON.stringify({ nome, telefone, endereco, observacao })
    );

    // ❌ NÃO limpar carrinho aqui
    // ❌ NÃO alert aqui

    console.log("INDO PARA PIX...");
    navigate("/pix", { replace: true });

  } catch (err) {
    console.error("ERRO CHECKOUT:", err);
    alert("Erro ao criar pedido");
  }

  setLoading(false);


    try {
      const res = await fetch(
        "https://sublimacao-store.onrender.com/pedidos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      frontend/src/pages/Checkout.jsx
    } catch (err) {
      console.error("ERRO CHECKOUT:", err);
      alert("Erro ao criar pedido");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <button onClick={() => navigate("/carrinho")}>
        ← Voltar
      </button>

      <h1>Finalizar Pedido</h1>

      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <br /><br />

      <input placeholder="WhatsApp" value={telefone} onChange={e => setTelefone(e.target.value)} />
      <br /><br />

      <input placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} />
      <br /><br />

      <textarea placeholder="Observações" value={observacao} onChange={e => setObservacao(e.target.value)} />
      <br /><br />

      <button disabled={loading} onClick={continuar}>
        {loading ? "Criando pedido..." : "Continuar para PIX"}
      </button>
    </div>
  );
}