import crypto from "crypto";
import { NextResponse } from "next/server";
import { parseTopUpReference } from "@/lib/top-up-reference";
import { completeTopUp } from "@/lib/top-up";
import type { Currency } from "@/lib/tokenCalculator";

export const runtime = "nodejs";

function verifySignature(body: string, signature: string) {
  const secret = process.env.TRANSFERMIT_WEBHOOK_SECRET!;
  const hash = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return hash === signature;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-transfermit-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const payment = event?.payment;

  if (!payment || payment.state !== "SUCCESS") {
    return NextResponse.json({ ok: true });
  }

  const referenceId = payment.referenceId as string | undefined;
  if (!referenceId) {
    return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
  }

  const reference = parseTopUpReference(referenceId);
  if (!reference) {
    return NextResponse.json({ error: "Invalid payment reference" }, { status: 400 });
  }

  const amount = Number(payment.amount);
  const currency = payment.currency as Currency;
  const externalRef =
    typeof payment.id === "string" && payment.id.trim()
      ? `transfermit:${payment.id}`
      : `transfermit:${referenceId}`;

  const completion = await completeTopUp({
    amount: Number.isFinite(amount) && amount > 0 ? amount : reference.amount,
    currency: typeof currency === "string" ? currency : reference.currency,
    externalRef,
    locale: reference.locale,
    planName: reference.planName,
    planType: reference.planType,
    source: "transfermit",
    userId: reference.userId,
  });

  console.info("[TOPUP][TRANSFERMIT] Completion result:", {
    delivery: completion.delivery,
    duplicate: completion.duplicate,
    externalRef,
    transactionId: completion.transactionId,
  });

  return NextResponse.json({ ok: true });
}
