const usuarioResponse = await fetch(
  "https://sublimacao-store.onrender.com/usuarios",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome,
      email: `${telefone}@cliente.com`,
      telefone
    })
  }
);

if (!usuarioResponse.ok) {
  const erro = await usuarioResponse.json();

  if (
    erro.error !== "Este e-mail já está cadastrado."
  ) {
    throw new Error(erro.error);
  }
}