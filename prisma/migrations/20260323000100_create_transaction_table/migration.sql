CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "tokenAmount" INTEGER NOT NULL,
  "amount" DOUBLE PRECISION,
  "currency" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Transaction_userId_fkey'
  ) THEN
    ALTER TABLE "Transaction"
      ADD CONSTRAINT "Transaction_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
