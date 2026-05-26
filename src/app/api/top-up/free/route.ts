import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { completeTopUp, getTopUpSuccessRedirect } from "@/lib/top-up";
import { isWithoutPaymentEnabled } from "@/lib/payment-mode";
import type { Currency, PlanType } from "@/lib/tokenCalculator";

function isPlanType(value: string | null): value is PlanType {
  return value === "lite" || value === "standard" || value === "pro" || value === "custom";
}

export async function GET(request: Request) {
  try {
    if (!isWithoutPaymentEnabled()) {
      return new NextResponse("Test mode is disabled.", { status: 403 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const amount = Number(url.searchParams.get("amount") || "0");
    const currency = (url.searchParams.get("currency")?.toUpperCase() ?? "EUR") as Currency;
    const planType = url.searchParams.get("planType");
    const planName = url.searchParams.get("planName") ?? planType ?? "custom";

    if (!Number.isFinite(amount) || amount <= 0 || !isPlanType(planType)) {
      return new NextResponse("Invalid parameters", { status: 400 });
    }

    const completion = await completeTopUp({
      amount,
      currency,
      customerEmail: session.user.email,
      customerName: session.user.name,
      externalRef: `free-route:${crypto.randomUUID()}`,
      planName,
      planType,
      source: "free-route",
      userId: session.user.id,
    });

    console.info("[TOPUP][FREE_ROUTE] Completion result:", {
      delivery: completion.delivery,
      transactionId: completion.transactionId,
    });

    return NextResponse.json({
      redirectUrl: getTopUpSuccessRedirect(completion.tokensAdded),
      success: true,
      tokensAdded: completion.tokensAdded,
    });
  } catch (error) {
    console.error("FREE_TOPUP_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
