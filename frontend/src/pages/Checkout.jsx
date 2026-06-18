import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const produto = location.state?.produto;

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

 async function continuar() {
  console.log("CHEGOU NA FUNÇÃO CONTINUAR");

  if (loading) return;

  const carrinho =
    JSON.parse(localStorage.getItem("carrinho")) || [];

  // resto do código...


    if (!carrinho.length) {
      alert("Seu carrinho está vazio");
      navigate("/carrinho");
      return;
    }

    if (!nome || !telefone || !endereco) {
      alert("Preencha todos os dados obrigatórios");
      return;
    }

    setLoading(true);

    try {
  console.log("=== CARRINHO ANTES DO PEDIDO ===");
  console.log(carrinho);

  carrinho.forEach((item, index) => {
    console.log(`ITEM ${index}:`, item);
    console.log(
      `ITEM ${index} - imagem existe?`,
      !!item.imagem
    );
    console.log(
      `ITEM ${index} - tamanho da imagem:`,
      item.imagem?.length
    );
    console.log(
      `ITEM ${index} - início da imagem:`,
      item.imagem?.substring(0, 100)
    );
  });

  const total = carrinho.reduce(
    (acc, item) =>
      acc + Number(item.preco) * item.quantidade,
    0
  );

  const pedidoLocal = {
    itens: carrinho,
    total,
    cliente: nome,
    telefone,
    endereco,
    observacao,
    status: "pendente",
    data: new Date().toISOString()
  };

  console.log("=== PEDIDO LOCAL ===");
  console.log(pedidoLocal);

  console.log(
    "TAMANHO DO JSON DO PEDIDO:",
    JSON.stringify(pedidoLocal).length
  );

  const res = await fetch(
    "https://sublimacao-store.onrender.com/pedidos",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedidoLocal),
    }
  );

  const data = await res.json();

  console.log("=== RESPOSTA DA API ===");
  console.log(data);

  if (!res.ok) {
    throw new Error(data?.error || "Erro ao criar pedido");
  }

  localStorage.setItem(
    "cliente",
    JSON.stringify({
      nome,
      telefone,
      endereco,
      observacao
    })
  );

  localStorage.setItem("pedidoId", data.id);

  let pedidos =
    JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos.push({
    id: data.id,
    ...pedidoLocal
  });

  console.log(
    "TAMANHO DO JSON DOS PEDIDOS:",
    JSON.stringify(pedidos).length
  );

  localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidos)
  );

  console.log(
    "=== PEDIDOS SALVOS NO LOCALSTORAGE ==="
  );
  console.log(
    JSON.parse(localStorage.getItem("pedidos"))
  );

  console.log("PEDIDO CRIADO:", data);

  localStorage.removeItem("carrinho");

  navigate("/pix");

} catch (err) {
  console.error("ERRO CHECKOUT:", err);
  alert("Erro ao criar pedido");
}

    setLoading(false);
  }

  if (!produto && !localStorage.getItem("carrinho")) {
    return <h2>Carrinho vazio</h2>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <button onClick={() => navigate("/carrinho")}>
        ← Voltar
      </button>

      <h1>Finalizar Pedido</h1>

      <input
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="WhatsApp"
        value={telefone}
        onChange={e => setTelefone(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Endereço"
        value={endereco}
        onChange={e => setEndereco(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Observações"
        value={observacao}
        onChange={e => setObservacao(e.target.value)}
      />
      <br /><br />

      <button onClick={continuar} disabled={loading}>
        {loading ? "Criando pedido..." : "Continuar para PIX"}
      </button>
    </div>
  );
}
localStorage.setItem(
  "pedidoAtual",
  JSON.stringify({
    id: data.id,
    total
  })
);