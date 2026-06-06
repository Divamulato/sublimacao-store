import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* =========================
   🔵 LISTAR PRODUTOS
========================= */
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

/* =========================
   🔵 BUSCAR PRODUTO POR ID (FALTAVA!)
========================= */
app.get("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) }
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(produto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

/* =========================
   🟢 CRIAR PRODUTO
========================= */
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

/* =========================
   🟡 ATUALIZAR PRODUTO
========================= */
app.put("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, imagem } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID obrigatório" });
    }

    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        nome,
        descricao,
        preco: Number(preco),
        imagem
      }
    });

    res.json(produto);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

/* =========================
   🔴 DELETAR PRODUTO
========================= */
app.delete("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID obrigatório" });
    }

    await prisma.produto.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Produto deletado com sucesso" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});