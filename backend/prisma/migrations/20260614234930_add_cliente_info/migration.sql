-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "observacao" TEXT,
ADD COLUMN     "telefone" TEXT;

-- CreateTable
CREATE TABLE "Visita" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);
