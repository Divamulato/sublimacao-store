app.post("/produtos", async (req, res) => {
  try {
    const { nome, descricao, preco, imagem } = req.body;

    if (!nome || nome.trim() === "" || preco === undefined || preco === null) {
      return res.status(400).json({
        error: "Nome e preço são obrigatórios"
      });
    }

    const precoNumero = Number(preco);

    if (isNaN(precoNumero) || precoNumero <= 0) {
      return res.status(400).json({
        error: "Preço inválido"
      });
    }

    const produto = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao,
        preco: precoNumero,
        imagem: imagem ?? null
      }
    });

    return res.status(201).json(produto);

  } catch (error) {
    console.error("ERRO PRISMA:", error);

    return res.status(500).json({
      error: "Erro interno ao criar produto",
      details: error.message,
      code: error.code || null
    });
  }
});