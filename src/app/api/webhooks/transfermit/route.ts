import crypto from "crypto";
import { NextResponse } from "next/server";
import { processTransfermitPayment } from "@/lib/top-up-order";
import { extractTransfermitPayment } from "@/lib/transfermit";

export const runtime = "nodejs";

function verifySignature(body: string, signature: string) {
  const secret = process.env.TRANSFERMIT_WEBHOOK_SECRET!;
  const hash = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const normalizedSignature = signature.replace(/^sha256=/i, "").trim();

  if (normalizedSignature.length !== hash.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(normalizedSignature));
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("Signature") ?? req.headers.get("x-transfermit-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const payment = extractTransfermitPayment(event);

  if (!payment) {
    return NextResponse.json({ error: "Invalid payment payload" }, { status: 400 });
  }

  const result = await processTransfermitPayment(payment, { trigger: "webhook" });

  return NextResponse.json({
    ok: true,
    status: result.normalizedState,
  });
}
