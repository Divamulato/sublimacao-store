import express from "express";
import cors from "cors";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/**
 * 🔥 TESTE DE CONEXÃO COM BANCO
 */
app.get("/test-db", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json({
      status: "OK",
      data: usuarios
    });
  } catch (error) {
    console.error("Erro no /test-db:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Erro ao acessar banco"
    });
  }
});

/**
 * 📦 LISTAR PRODUTOS
 */
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

app.post("/produtos", async (req, res) => {

  try {

    const {
      nome,
      descricao,
      preco
    } = req.body;

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco
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
/**
 * 🚀 START SERVER
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({
    status: "API rodando",
    endpoints: [
      "/produtos",
      "/test-db"
    ]
  });
});