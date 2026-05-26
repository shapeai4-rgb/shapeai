import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { completeTopUp, getTopUpSuccessRedirect } from "@/lib/top-up";
import { isWithoutPaymentEnabled } from "@/lib/payment-mode";
import { createTopUpReference } from "@/lib/top-up-reference";
import type { Currency, PlanType } from "@/lib/tokenCalculator";
import { getLocaleFromRequest } from "@/i18n/server";

export const runtime = "nodejs";

const TM_API_URL = process.env.TRANSFERMIT_API_URL!;
const TM_API_KEY = process.env.TRANSFERMIT_API_KEY!;
const SITE_URL = process.env.TRANSFERMIT_WEBSITE_URL!;
const SUCCESS_URL = process.env.TRANSFERMIT_SUCCESS_URL!;
const DECLINE_URL = process.env.TRANSFERMIT_DECLINE_URL!;

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  const ip = xff?.split(",")[0]?.trim();
  return ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip) ? ip : "8.8.8.8";
}

function isPlanType(value: unknown): value is PlanType {
  return value === "lite" || value === "standard" || value === "pro" || value === "custom";
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const locale = getLocaleFromRequest(req);
    const amount = Number(body.amount);
    const currency = (body.currency ?? "EUR") as Currency;
    const planType = body.planType;
    const planName = typeof body.planName === "string" ? body.planName : "";

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 422 });
    }

    if (!isPlanType(planType) || !planName.trim()) {
      return NextResponse.json({ error: "Invalid plan details" }, { status: 422 });
    }

    if (isWithoutPaymentEnabled()) {
      const externalRef = `testmode:${crypto.randomUUID()}`;
      const completion = await completeTopUp({
        amount,
        currency,
        customerEmail: session.user.email,
        customerName: session.user.name,
        externalRef,
        locale,
        planName,
        planType,
        source: "test-mode",
        userId: session.user.id,
      });

      console.info("[TOPUP][TEST_MODE] Completion result:", {
        delivery: completion.delivery,
        externalRef,
        transactionId: completion.transactionId,
      });

      return NextResponse.json({
        mode: "bypass",
        redirectUrl: getTopUpSuccessRedirect(completion.tokensAdded),
        tokensAdded: completion.tokensAdded,
      });
    }

    const referenceId = createTopUpReference({
      amount,
      currency,
      locale,
      nonce: crypto.randomBytes(6).toString("hex"),
      planName,
      planType,
      userId: session.user.id,
    });

    const payload = {
      amount,
      currency,
      customer: {
        email: session.user.email,
        firstName: session.user.name ?? "User",
        ip: getClientIp(req),
        lastName: "Client",
        locale,
        referenceId: `USER_${session.user.id}`,
      },
      declineReturnUrl: `${DECLINE_URL}?id={id}&ref={referenceId}&state={state}`,
      description: `Top-up: ${planName}`,
      paymentMethod: "BASIC_CARD",
      paymentType: "DEPOSIT",
      referenceId,
      successReturnUrl: `${SUCCESS_URL}?id={id}&ref={referenceId}&state={state}`,
      webhookUrl: `${SITE_URL.replace(/\/+$/, "")}/api/webhooks/transfermit`,
      websiteUrl: SITE_URL.replace(/\/+$/, ""),
    };

    const res = await fetch(`${TM_API_URL}/payments`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const payment = data?.result ?? data;

    if (!res.ok || !payment?.redirectUrl) {
      return NextResponse.json({ error: "Gateway error" }, { status: 502 });
    }

    return NextResponse.json({
      mode: "gateway",
      paymentId: payment.id,
      redirectUrl: payment.redirectUrl,
      referenceId,
    });
  } catch (error) {
    console.error("[TOPUP] Create order failed:", error);
    return NextResponse.json({ error: "Create order failed" }, { status: 500 });
  }
}
