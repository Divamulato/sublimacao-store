import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// =========================
// CLOUDINARY CONFIG (SEGURO)
// =========================
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("🔥 CLOUDINARY CHECK:", {
  cloud: cloudName,
  key: apiKey ? "OK" : "MISSING",
  secret: apiSecret ? "OK" : "MISSING",
});

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ CLOUDINARY ENV NÃO DEFINIDA");
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

// =========================
// MULTER CONFIG
// =========================
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
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
// UPLOAD IMAGEM (DEBUG TOTAL)
// =========================
app.post("/upload", upload.single("imagem"), async (req, res) => {
  try {
    console.log("📦 FILE DEBUG:", {
      exists: !!req.file,
      size: req.file?.size,
      type: req.file?.mimetype,
    });

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        error: "Cloudinary não configurado",
      });
    }

    const base64 = req.file.buffer.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64}`,
      {
        folder: "sublimacao-store",
      }
    );

    return res.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error("🔥 CLOUDINARY ERROR COMPLETO:", error);

    return res.status(500).json({
      error: "Falha no upload",
      message: error.message,
      name: error.name,
      stack: error.stack,
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

// =========================
// CRIAR PRODUTO
// =========================

app.post("/produtos", async (req, res) => {
try {
  console.log("📦 DADOS RECEBIDOS PARA CRIAR PRODUTO:", req.body);
const {
  
nome,
descricao,
preco,
estoque,
imagem,
} = req.body;

// =========================
// VALIDAÇÃO DO NOME
// =========================

if (!nome || nome.trim() === "") {
  return res.status(400).json({
    error: "Nome do produto é obrigatório",
  });
}

// =========================
// CONVERTER PREÇO
// =========================

const precoNumero = Number(preco);

if (
  isNaN(precoNumero) ||
  precoNumero <= 0
) {
  return res.status(400).json({
    error: "Preço inválido",
  });
}

// =========================
// CONVERTER ESTOQUE
// =========================

const estoqueNumero =
  estoque === undefined ||
  estoque === null ||
  estoque === ""
    ? 0
    : Number(estoque);

if (
  isNaN(estoqueNumero) ||
  estoqueNumero < 0
) {
  return res.status(400).json({
    error: "Estoque inválido",
  });
}

// =========================
// CRIAR PRODUTO
// =========================

const produto =
  await prisma.produto.create({
    data: {
      nome: nome.trim(),

      descricao:
        descricao && descricao.trim() !== ""
          ? descricao.trim()
          : null,

      preco: precoNumero,

      estoque: estoqueNumero,

      imagem:
        imagem && imagem.trim() !== ""
          ? imagem
          : null,
    },
  });

console.log(
  "✅ PRODUTO CRIADO:",
  produto
);

return res.status(201).json(produto);

} catch (error) {

console.error(
  "❌ ERRO AO CRIAR PRODUTO:",
  error
);

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

const {
  nome,
  descricao,
  preco,
  estoque,
  imagem,
} = req.body;

// =========================
// CONVERTER PREÇO
// =========================

const precoNumero = Number(preco);

if (
  isNaN(precoNumero) ||
  precoNumero <= 0
) {
  return res.status(400).json({
    error: "Preço inválido",
  });
}

// =========================
// CONVERTER ESTOQUE
// =========================

const estoqueNumero =
  estoque === undefined ||
  estoque === null ||
  estoque === ""
    ? 0
    : Number(estoque);

if (
  isNaN(estoqueNumero) ||
  estoqueNumero < 0
) {
  return res.status(400).json({
    error: "Estoque inválido",
  });
}

// =========================
// BUSCAR PRODUTO ATUAL
// =========================

const produtoAtual =
  await prisma.produto.findUnique({
    where: {
      id: Number(id),
    },
  });

if (!produtoAtual) {
  return res.status(404).json({
    error: "Produto não encontrado",
  });
}

// =========================
// PRESERVAR IMAGEM
// =========================

const imagemFinal =
  imagem && imagem.trim() !== ""
    ? imagem
    : produtoAtual.imagem;

// =========================
// ATUALIZAR PRODUTO
// =========================

const produtoAtualizado =
  await prisma.produto.update({
    where: {
      id: Number(id),
    },

    data: {
      nome:
        nome?.trim() ||
        produtoAtual.nome,

      descricao:
        descricao?.trim() ||
        null,

      preco:
        precoNumero,

      estoque:
        estoqueNumero,

      imagem:
        imagemFinal,
    },
  });

console.log(
  "✅ PRODUTO ATUALIZADO:",
  produtoAtualizado
);

return res.json(
  produtoAtualizado
);

} catch (error) {

console.error(
  "❌ ERRO AO ATUALIZAR PRODUTO:",
  error
);

return res.status(500).json({
  error: "Erro ao atualizar produto",
  details: error.message,
});

}
});

// =========================
// START SERVER
// =========================

app.post("/pedidos", async (req, res) => {

   console.log(">>> BUSCANDO PEDIDO", req.params.id);

  try {

    const {
      itens,
      total,
      cliente,
      email,
      telefone,
      endereco,
      observacao
    } = req.body;


    // procura o cliente cadastrado
    const usuario = await prisma.usuario.findUnique({
      where: {
        email
      }
    });


    const pedido = await prisma.pedido.create({
      data: {

        itens,

        total: Number(total),

        cliente,
        email,
        telefone,
        endereco,
        observacao,

        status: "pendente",

        // ligação com usuário
        usuarioId: usuario?.id || null

      },

      include: {
        usuario: true
      }

    });


    return res.status(201).json(pedido);


  } catch (error) {

    console.error("❌ ERRO PEDIDO:", error);

    return res.status(500).json({
      error: error.message
    });

  }
});

// ============================
// LISTAR TODOS OS PEDIDOS
// ============================

app.get("/pedidos", async (req, res) => {
  try {

    const pedidos = await prisma.pedido.findMany({

      include: {
        usuario: true
      },

      orderBy: {
        createdAt: "desc"
      }

    });

    return res.json(pedidos);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }
});


// ============================
// BUSCAR PEDIDO POR ID
// ============================

console.log(">>> ROTA DETALHES PEDIDO REGISTRADA");

app.get("/pedidos/:id", async (req, res) => {

  try {

    const id = Number(req.params.id);

    const pedido = await prisma.pedido.findUnique({

      where: {
        id
      },

      include: {
        usuario: true
      }

    });

    if (!pedido) {

      return res.status(404).json({
        error: "Pedido não encontrado."
      });

    }

    return res.json(pedido);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }

});

app.post("/visitas", async (req, res) => {
  try {

    const visita =
      await prisma.visita.create({
        data: {}
      });

    res.json(visita);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao registrar visita"
    });

  }
});

app.get("/visitas", async (req, res) => {
  try {

    const total = await prisma.visita.count();

    res.json({
      total
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar visitas"
    });

  }
});



app.delete("/pedidos/:id", async (req, res) => {
  try {

    await prisma.pedido.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.json({
      sucesso: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao excluir pedido"
    });

  }
});

app.put("/pedidos/:id/status", async (req, res) => {
  try {

    const { status } = req.body;

    const pedido =
      await prisma.pedido.update({
        where: {
          id: Number(req.params.id)
        },
        data: {
          status
        }
      });

    res.json(pedido);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao atualizar status"
    });

  }
});

app.delete("/visitas", async (req, res) => {
  try {
    await prisma.visita.deleteMany({});

    res.json({
      sucesso: true,
      mensagem: "Visitas zeradas"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao zerar visitas"
    });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({
        error: "Nome, e-mail e telefone são obrigatórios.",
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        error: "Este e-mail já está cadastrado.",
      });
    }

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
      },
    });

    return res.status(201).json(usuario);
  } catch (error) {
    console.error("ERRO AO CADASTRAR USUÁRIO:", error);

    return res.status(500).json({
      error: "Erro ao cadastrar usuário.",
    });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(usuarios);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar usuários",
    });
  }
});

// =========================
// START SERVER
// =========================


process.on("uncaughtException", (err) => {
  console.error("ERRO NÃO TRATADO:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("PROMISE NÃO TRATADA:");
  console.error(err);
});

process.on("exit", (code) => {
  console.log("Processo encerrado. Código:", code);
});



process.on("unhandledRejection", (err) => {
  console.error("PROMISE NÃO TRATADA:");
  console.error(err);
});

// =========================
// CLIENTES CRM
// =========================

app.get("/clientes", async (req, res) => {

  try {

    const clientes = await prisma.usuario.findMany({

      include: {

        pedidos: {
          orderBy: {
            createdAt: "desc"
          }
        }

      }

    });


    const resultado = clientes.map(cliente => {


      const totalPedidos = cliente.pedidos.length;


      const totalGasto = cliente.pedidos.reduce(
        (total, pedido) => {
          return total + pedido.total;
        },
        0
      );


      const ultimaCompra =
        cliente.pedidos.length > 0
          ? cliente.pedidos[0].createdAt
          : null;



      return {

        id: cliente.id,

        nome: cliente.nome,

        email: cliente.email,

        telefone: cliente.telefone,


        totalPedidos,


        totalGasto,


        ultimaCompra,


        status:

          totalPedidos >= 5
            ? "VIP"

            : totalPedidos >= 2
              ? "Frequente"

              : "Novo"

      };


    });


    res.json(resultado);


  } catch(error) {


    console.error(
      "ERRO CLIENTES CRM:",
      error
    );


    res.status(500).json({

      error:
      "Erro ao buscar clientes"

    });


  }

});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

server.on("error", (err) => {
  console.error("Erro ao iniciar servidor:");
  console.error(err);
});

// =========================
// DETALHES DO CLIENTE
// =========================
app.get("/clientes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const cliente = await prisma.usuario.findUnique({
      where: {
        id,
      },
      include: {
        pedidos: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }

    const totalPedidos = cliente.pedidos.length;

    const totalGasto = cliente.pedidos.reduce(
      (total, pedido) =>
        total + Number(pedido.total),
      0
    );

    res.json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      createdAt: cliente.createdAt,

      totalPedidos,
      totalGasto,

      pedidos: cliente.pedidos,
    });

  } catch (error) {
    console.error("ERRO CLIENTE:", error);

    res.status(500).json({
      error: "Erro ao buscar cliente",
    });
  }
});