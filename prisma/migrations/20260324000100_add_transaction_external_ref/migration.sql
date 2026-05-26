ALTER TABLE "Transaction"
ADD COLUMN "source" TEXT,
ADD COLUMN "externalRef" TEXT;

CREATE UNIQUE INDEX "Transaction_externalRef_key" ON "Transaction"("externalRef");
