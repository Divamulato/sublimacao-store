import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API =
  "https://sublimacao-store.onrender.com";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function entrar(e) {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!usuario || !senha) {
      alert(
        "Informe usuário e senha."
      );

      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch(
        `${API}/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            usuario,
            senha,
          }),
        }
      );

      const data =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          data?.error ||
            "Erro ao realizar login"
        );
      }

      // ==========================
      // SALVAR TOKEN
      // ==========================

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUsuario",
        data.usuario
      );

      // ==========================
      // ENTRAR NO ADMIN
      // ==========================

      navigate("/admin");

    } catch (error) {
      console.error(
        "❌ ERRO LOGIN:",
        error
      );

      alert(
        error.message ||
          "Usuário ou senha inválidos."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
      }}
    >
      <h1>
        Login Admin
      </h1>

      <form onSubmit={entrar}>

        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) =>
            setUsuario(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Entrando..."
            : "Entrar"}
        </button>

      </form>
    </div>
  );
}