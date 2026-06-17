import type { Prisma } from "@prisma/client";
import { DEFAULT_LOCALE, normalizeLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { completeTopUp, type CompleteTopUpResult } from "@/lib/top-up";
import { parseTopUpReference } from "@/lib/top-up-reference";
import type { Currency, PlanType } from "@/lib/tokenCalculator";
import {
  normalizeTransfermitState,
  type TransfermitNormalizedState,
  type TransfermitPayment,
} from "@/lib/transfermit";

type OrderInput = {
  amount: number;
  currency: Currency;
  gatewayState?: string | null;
  locale: Locale;
  planName: string;
  planType: PlanType;
  rawPayload?: TransfermitPayment | null;
  referenceId: string;
  transfermitPaymentId?: string | null;
  userId: string;
};

type ProcessResult = {
  completion?: CompleteTopUpResult;
  gatewayState: string | null;
  normalizedState: TransfermitNormalizedState;
  orderId: string;
  paymentId: string | null;
  referenceId: string;
};

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  return value as Prisma.InputJsonValue;
}

function isPlanType(value: string): value is PlanType {
  return value === "lite" || value === "standard" || value === "pro" || value === "custom";
}

function normalizeCurrency(value: string | undefined, fallback: string): Currency {
  return (value || fallback || "EUR") as Currency;
}

function normalizePlanType(value: string): PlanType {
  return isPlanType(value) ? value : "custom";
}

function getPaymentId(payment: TransfermitPayment) {
  return typeof payment.id === "string" && payment.id.trim() ? payment.id.trim() : null;
}

function getReferenceId(payment: TransfermitPayment) {
  return typeof payment.referenceId === "string" && payment.referenceId.trim()
    ? payment.referenceId.trim()
    : null;
}

function getGatewayState(payment: TransfermitPayment) {
  return typeof payment.state === "string" && payment.state.trim() ? payment.state.trim() : null;
}

function externalRefFor(paymentId: string | null, referenceId: string) {
  return paymentId ? `transfermit:${paymentId}` : `transfermit:${referenceId}`;
}

export async function createTopUpOrder(input: OrderInput) {
  const gatewayState = input.gatewayState ?? null;
  const normalizedState = gatewayState ? normalizeTransfermitState(gatewayState) : "pending";

  return prisma.topUpOrder.upsert({
    where: { referenceId: input.referenceId },
    create: {
      amount: input.amount,
      currency: input.currency,
      gatewayState,
      locale: input.locale,
      normalizedState,
      planName: input.planName,
      planType: input.planType,
      rawPayload: toJson(input.rawPayload),
      referenceId: input.referenceId,
      transfermitPaymentId: input.transfermitPaymentId,
      userId: input.userId,
    },
    update: {
      gatewayState,
      normalizedState,
      rawPayload: toJson(input.rawPayload),
      transfermitPaymentId: input.transfermitPaymentId,
    },
  });
}

export async function processTransfermitPayment(
  payment: TransfermitPayment,
  options: {
    expectedUserId?: string;
    trigger: "webhook" | "reconcile";
  }
): Promise<ProcessResult> {
  const paymentId = getPaymentId(payment);
  const referenceId = getReferenceId(payment);
  const gatewayState = getGatewayState(payment);
  const normalizedState = normalizeTransfermitState(gatewayState);

  if (!referenceId) {
    throw new Error("Transfermit payment referenceId is missing");
  }

  const reference = parseTopUpReference(referenceId);
  let order = paymentId
    ? await prisma.topUpOrder.findFirst({
        where: {
          OR: [{ transfermitPaymentId: paymentId }, { referenceId }],
        },
      })
    : await prisma.topUpOrder.findUnique({ where: { referenceId } });

  if (!order) {
    if (!reference) {
      throw new Error("Transfermit payment order was not found and reference is invalid");
    }

    order = await createTopUpOrder({
      amount: reference.amount,
      currency: reference.currency,
      gatewayState,
      locale: reference.locale ?? DEFAULT_LOCALE,
      planName: reference.planName,
      planType: reference.planType,
      rawPayload: payment,
      referenceId,
      transfermitPaymentId: paymentId,
      userId: reference.userId,
    });
  }

  if (options.expectedUserId && order.userId !== options.expectedUserId) {
    throw new Error("Payment order does not belong to the current user");
  }

  const resolvedPaymentId = paymentId ?? order.transfermitPaymentId;

  if (order.completedAt && normalizedState !== "completed") {
    await prisma.topUpOrder.update({
      where: { id: order.id },
      data: {
        gatewayState,
        lastCheckedAt: new Date(),
        lastError: null,
        rawPayload: toJson(payment),
        transfermitPaymentId: resolvedPaymentId,
      },
    });

    return {
      gatewayState,
      normalizedState: "completed",
      orderId: order.id,
      paymentId: resolvedPaymentId,
      referenceId,
    };
  }

  const updatedOrder = await prisma.topUpOrder.update({
    where: { id: order.id },
    data: {
      failedAt: normalizedState === "failed" ? new Date() : order.failedAt,
      gatewayState,
      lastCheckedAt: new Date(),
      lastError: null,
      normalizedState,
      rawPayload: toJson(payment),
      transfermitPaymentId: resolvedPaymentId,
    },
  });

  console.info("[TOPUP][TRANSFERMIT] Payment state update:", {
    gatewayState,
    normalizedState,
    orderId: updatedOrder.id,
    paymentId: resolvedPaymentId,
    referenceId,
    trigger: options.trigger,
    userId: updatedOrder.userId,
  });

  if (normalizedState !== "completed") {
    return {
      gatewayState,
      normalizedState,
      orderId: updatedOrder.id,
      paymentId: resolvedPaymentId,
      referenceId,
    };
  }

  const amountFromGateway = Number(payment.amount);
  const completion = await completeTopUp({
    amount: Number.isFinite(amountFromGateway) && amountFromGateway > 0 ? amountFromGateway : updatedOrder.amount,
    currency: normalizeCurrency(payment.currency, updatedOrder.currency),
    externalRef: externalRefFor(resolvedPaymentId, referenceId),
    locale: normalizeLocale(updatedOrder.locale),
    planName: updatedOrder.planName,
    planType: normalizePlanType(updatedOrder.planType),
    source: "transfermit",
    userId: updatedOrder.userId,
  });

  await prisma.topUpOrder.update({
    where: { id: updatedOrder.id },
    data: {
      completedAt: new Date(),
      normalizedState: "completed",
      transactionId: completion.transactionId,
    },
  });

  console.info("[TOPUP][TRANSFERMIT] Completion result:", {
    delivery: completion.delivery,
    duplicate: completion.duplicate,
    externalRef: completion.externalRef,
    orderId: updatedOrder.id,
    paymentId: resolvedPaymentId,
    transactionId: completion.transactionId,
    trigger: options.trigger,
  });

  return {
    completion,
    gatewayState,
    normalizedState,
    orderId: updatedOrder.id,
    paymentId: resolvedPaymentId,
    referenceId,
  };
}
