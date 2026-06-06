app.post("/produtos", async (req, res) => {

  try {

    const {
      nome,
      descricao,
      preco,
      imagem
    } = req.body;

    if (!nome || preco === undefined || preco === null) {
      return res.status(400).json({
        error: "Nome e preço são obrigatórios"
      });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: Number(preco),
        imagem: imagem || null
      }
    });

    res.status(201).json(produto);

  } catch (error) {

    console.error("ERRO PRISMA:", error);

    res.status(500).json({
      error: error.message,
      code: error.code || null
    });

  }

});