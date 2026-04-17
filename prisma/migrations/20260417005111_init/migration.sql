-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "compra" TEXT,
    "venta" TEXT,
    "valor" TEXT,
    "moneda" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Cotizacion_tipo_createdAt_idx" ON "Cotizacion"("tipo", "createdAt");
