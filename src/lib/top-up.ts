import { prisma } from "@/lib/prisma";
import { sendTopUpInvoiceEmail } from "@/lib/invoice-delivery";
import { calculateTokens, type Currency, type PlanType } from "@/lib/tokenCalculator";
import { deliverySkipped, type EmailDeliveryResult } from "@/lib/email-delivery-result";

type TopUpSource = "test-mode" | "transfermit" | "manual" | "free-route";

type CompleteTopUpInput = {
  userId: string;
  amount: number;
  currency: Currency;
  planType: PlanType;
  planName: string;
  source: TopUpSource;
  externalRef: string;
  customerEmail?: string | null;
  customerName?: string | null;
};

export type CompleteTopUpResult = {
  duplicate: boolean;
  delivery: EmailDeliveryResult;
  externalRef: string;
  newBalance: number;
  tokensAdded: number;
  transactionId: string;
};

export function getTopUpSuccessRedirect(tokensAdded: number) {
  const origin =
    process.env.NODE_ENV === "production"
      ? "https://shapeai.co.uk"
      : "http://localhost:3000";

  return `${origin}/dashboard?payment_success=true&tokens_added=${tokensAdded}`;
}

function buildCustomerName(
  fallbackEmail: string | null | undefined,
  overrideName: string | null | undefined,
  user: {
    name: string | null;
    firstName: string | null;
    lastName: string | null;
  }
) {
  if (overrideName?.trim()) {
    return overrideName.trim();
  }

  const nameFromParts = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return user.name ?? (nameFromParts || fallbackEmail || "ShapeAI customer");
}

export async function completeTopUp(input: CompleteTopUpInput): Promise<CompleteTopUpResult> {
  const existingTransaction = await prisma.transaction.findUnique({
    where: { externalRef: input.externalRef },
  });

  if (existingTransaction) {
    const existingUser = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { tokenBalance: true },
    });

    return {
      duplicate: true,
      delivery: {
        sent: false,
        error: "Duplicate top-up event skipped.",
      },
      externalRef: input.externalRef,
      newBalance: existingUser?.tokenBalance ?? 0,
      tokensAdded: existingTransaction.tokenAmount,
      transactionId: existingTransaction.id,
    };
  }

  const tokensAdded = calculateTokens(input.amount, input.planType);
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const customerEmail = input.customerEmail ?? user.email;
  const customerName = buildCustomerName(customerEmail, input.customerName, user);

  const { transaction, updatedUser } = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: input.userId },
      data: {
        tokenBalance: {
          increment: tokensAdded,
        },
      },
    });

    const created = await tx.transaction.create({
      data: {
        userId: input.userId,
        action: "topup",
        amount: input.amount,
        currency: input.currency,
        description: `Top-up: ${input.planName}`,
        externalRef: input.externalRef,
        source: input.source,
        tokenAmount: tokensAdded,
      },
    });

    return {
      transaction: created,
      updatedUser: updated,
    };
  });

  const delivery = customerEmail
    ? await sendTopUpInvoiceEmail({
        amount: input.amount,
        createdAt: transaction.createdAt,
        currency: input.currency,
        customerEmail,
        customerName,
        description: transaction.description,
        tokens: tokensAdded,
        transactionId: transaction.id,
      })
    : deliverySkipped("Invoice email skipped: customer email is missing.");

  return {
    duplicate: false,
    delivery,
    externalRef: input.externalRef,
    newBalance: updatedUser.tokenBalance,
    tokensAdded,
    transactionId: transaction.id,
  };
}
