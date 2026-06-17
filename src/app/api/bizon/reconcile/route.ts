import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { processTransfermitPayment } from "@/lib/top-up-order";
import { getTransfermitPayment } from "@/lib/transfermit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const paymentId = typeof body.paymentId === "string" ? body.paymentId.trim() : "";
    const referenceId = typeof body.referenceId === "string" ? body.referenceId.trim() : "";

    if (!paymentId) {
      return NextResponse.json({ error: "Payment id is required" }, { status: 422 });
    }

    const payment = await getTransfermitPayment(paymentId);
    if (!payment.referenceId && referenceId) {
      payment.referenceId = referenceId;
    }

    const result = await processTransfermitPayment(payment, {
      expectedUserId: session.user.id,
      trigger: "reconcile",
    });

    return NextResponse.json({
      gatewayState: result.gatewayState,
      mode: "gateway",
      orderId: result.orderId,
      paymentId: result.paymentId,
      referenceId: result.referenceId,
      status: result.normalizedState,
      tokensAdded: result.completion?.tokensAdded ?? null,
      transactionId: result.completion?.transactionId ?? null,
    });
  } catch (error) {
    console.error("[TOPUP][TRANSFERMIT] Reconciliation failed:", error);
    return NextResponse.json({ error: "Payment reconciliation failed" }, { status: 500 });
  }
}
