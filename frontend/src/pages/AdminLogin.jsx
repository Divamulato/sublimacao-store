import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  function entrar() {

    if (
      usuario === "Sergio" &&
      senha === "Mirage@123"
    ) {
      localStorage.setItem(
        "adminLogado",
        "true"
      );

      navigate("/admin");

      return;
    }

    alert("Usuário ou senha inválidos");
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px"
      }}
    >
      <h1>Login Admin</h1>

      <input
        placeholder="Usuário"
        value={usuario}
        onChange={(e) =>
          setUsuario(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) =>
          setSenha(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={entrar}>
        Entrar
      </button>
    </div>
  );
}