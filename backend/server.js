import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// =========================
// CLOUDINARY CONFIG
// =========================
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ CLOUDINARY ENV NÃO DEFINIDA");
}

cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: String(process.env.CLOUDINARY_API_KEY),
  api_secret: String(process.env.CLOUDINARY_API_SECRET),
});

// =========================
// MULTER CONFIG
// =========================
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// =========================
// APP INIT
// =========================
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =========================
// UPLOAD IMAGEM (CLOUDINARY)
// =========================

console.log("FILE RECEBIDO:", {
  hasFile: !!req.file,
  mimetype: req.file?.mimetype,
  size: req.file?.size,
});

app.post("/upload", upload.single("imagem"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    console.log("📦 FILE RECEBIDO:", {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "sublimacao-store",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("🔥 CLOUDINARY ERROR:", error);

          return res.status(500).json({
            error: "Cloudinary falhou",
            message: error.message,
            code: error.code || null,
          });
        }

        return res.json({
          url: result.secure_url,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("🔥 UPLOAD FATAL:", error);

    return res.status(500).json({
      error: "Erro interno no upload",
      message: error.message,
    });
  }
});

// =========================
// HEALTH CHECK
// =========================
app.get("/ping", (req, res) => {
  res.json({
    status: "ok",
    hora: new Date(),
  });
});

// =========================
// LISTAR PRODUTOS
// =========================
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// =========================
// BUSCAR PRODUTO POR ID
// =========================
app.get("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) },
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

// =========================
// CRIAR PRODUTO
// =========================
app.post("/produtos", async (req, res) => {
  try {
    const { nome, descricao, preco, imagem } = req.body;

    if (!nome || nome.trim() === "" || preco == null) {
      return res.status(400).json({
        error: "Nome e preço são obrigatórios",
      });
    }

    const precoNumero = Number(preco);

    if (isNaN(precoNumero) || precoNumero <= 0) {
      return res.status(400).json({ error: "Preço inválido" });
    }

    const produto = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao || null,
        preco: precoNumero,
        imagem: imagem || null,
      },
    });

    return res.status(201).json(produto);
  } catch (error) {
    console.error("PRISMA ERROR:", error);

    return res.status(500).json({
      error: "Erro interno ao criar produto",
      details: error.message,
    });
  }
});

// =========================
// ATUALIZAR PRODUTO
// =========================
app.put("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, imagem } = req.body;

    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        nome,
        descricao,
        preco: Number(preco),
        imagem,
      },
    });

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// =========================
// DELETAR PRODUTO
// =========================
app.delete("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.produto.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});