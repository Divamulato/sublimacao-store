import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {

  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");

  function continuar() {

    const dados = {
      nome,
      telefone,
      endereco,
      observacao
    };

    localStorage.setItem(
      "cliente",
      JSON.stringify(dados)
    );

    navigate("/pix");
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "0 auto",
        color: "#000"
      }}
    >

      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px"
        }}
      >
        ← Voltar
      </button>

      <h1>Finalizar Pedido</h1>

      <br />

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) =>
          setNome(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px"
        }}
      />

      <br /><br />

      <input
        placeholder="WhatsApp"
        value={telefone}
        onChange={(e) =>
          setTelefone(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px"
        }}
      />

      <br /><br />

      <input
        placeholder="Endereço"
        value={endereco}
        onChange={(e) =>
          setEndereco(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px"
        }}
      />

      <br /><br />

      <textarea
        placeholder="Observações"
        value={observacao}
        onChange={(e) =>
          setObservacao(e.target.value)
        }
        style={{
          width: "100%",
          height: "120px",
          padding: "12px"
        }}
      />

      <br /><br />

      <button
        onClick={continuar}
        style={{
          padding: "12px 25px",
          fontSize: "18px"
        }}
      >
        Continuar para PIX
      </button>

    </div>
  );
}