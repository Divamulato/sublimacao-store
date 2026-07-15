import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

const API = "https://sublimacao-store.onrender.com";

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [loading, setLoading] = useState(false);

  async function cadastrar(e) {
    e.preventDefault();
    console.log("Botão clicado");
    console.log({
  nome,
  email,
  telefone
});

console.log(response.status);

const dados = await response.json();

console.log(dados);



    if (!nome || !email || !telefone) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
  const erro = await response.json();

  throw new Error(erro.error || "Erro ao cadastrar.");
}

// salva o usuário para usar no checkout
localStorage.setItem(
  "usuario",
  JSON.stringify({
    nome,
    email,
    telefone,
  })
);

alert("Cadastro realizado com sucesso!");

navigate("/checkout");

    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">

        <h1>Criar Cadastro</h1>

        <p>
          Informe seus dados para continuar a compra.
        </p>

        <form onSubmit={cadastrar}>

          <label>Nome Completo</label>

          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>E-mail</label>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>WhatsApp</label>

          <input
            type="tel"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Cadastrando..."
              : "Continuar para o Checkout"}
          </button>

        </form>

      </div>
    </div>
  );
}