import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { completeTopUp } from "@/lib/top-up";
import type { Currency, PlanType } from "@/lib/tokenCalculator";

function isPlanType(value: unknown): value is PlanType {
  return value === "lite" || value === "standard" || value === "pro" || value === "custom";
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const amount = Number(body.amount);
    const planType = body.planType;
    const currency = (body.currency ?? "EUR") as Currency;
    const planName =
      typeof body.planName === "string" && body.planName.trim()
        ? body.planName
        : typeof planType === "string"
          ? planType
          : "custom";

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!isPlanType(planType)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    const completion = await completeTopUp({
      amount,
      currency,
      customerEmail: session.user.email,
      customerName: session.user.name,
      externalRef: `manual:${crypto.randomUUID()}`,
      planName,
      planType,
      source: "manual",
      userId: session.user.id,
    });

    console.info("[TOPUP][MANUAL] Completion result:", {
      delivery: completion.delivery,
      transactionId: completion.transactionId,
    });

    return NextResponse.json({
      success: true,
      tokensAdded: completion.tokensAdded,
      newBalance: completion.newBalance,
    });
  } catch (error: unknown) {
    console.error("add-tokens error:", error);
    return NextResponse.json(
      { error: "Failed to add tokens" },
      { status: 500 }
    );
  }
}
