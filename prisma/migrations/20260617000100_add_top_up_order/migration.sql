CREATE TABLE "TopUpOrder" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "transfermitPaymentId" TEXT,
  "referenceId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "planType" TEXT NOT NULL,
  "planName" TEXT NOT NULL,
  "locale" TEXT DEFAULT 'en',
  "gatewayState" TEXT,
  "normalizedState" TEXT NOT NULL DEFAULT 'pending',
  "rawPayload" JSONB,
  "transactionId" TEXT,
  "completedAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "lastCheckedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TopUpOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TopUpOrder_transfermitPaymentId_key" ON "TopUpOrder"("transfermitPaymentId");
CREATE UNIQUE INDEX "TopUpOrder_referenceId_key" ON "TopUpOrder"("referenceId");
CREATE INDEX "TopUpOrder_userId_idx" ON "TopUpOrder"("userId");
CREATE INDEX "TopUpOrder_normalizedState_idx" ON "TopUpOrder"("normalizedState");

ALTER TABLE "TopUpOrder"
  ADD CONSTRAINT "TopUpOrder_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
