import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, currency = "EUR" } = await req.json();
        if (!Number.isFinite(amount) || amount < 1) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 422 });
        }

        const topupId = crypto.randomUUID();
        const customRef = crypto.randomBytes(6).toString("hex");
        const referenceId = `topup=${topupId};ref=${customRef}`;

        const payload = {
            referenceId,
            paymentType: "DEPOSIT",
            paymentMethod: "BASIC_CARD",
            amount: Number(amount),
            currency,

            description: "Account top-up",

            customer: {
                referenceId: `USER_${session.user.id}`,
                firstName: session.user.name ?? "User",
                lastName: "Client",
                email: session.user.email,
                locale: "en",
                ip: getClientIp(req),
            },

            successReturnUrl: `${SUCCESS_URL}?id={id}&ref={referenceId}&state={state}`,
            declineReturnUrl: `${DECLINE_URL}?id={id}&ref={referenceId}&state={state}`,
            webhookUrl: `${SITE_URL}/api/transfermit/webhook`,
            websiteUrl: SITE_URL.replace(/\/+$/, ""),
        };

        const res = await fetch(`${TM_API_URL}/payments`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TM_API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        const payment = data?.result ?? data;

        if (!res.ok || !payment?.redirectUrl) {
            return NextResponse.json({ error: "Gateway error" }, { status: 502 });
        }

        return NextResponse.json({
            redirectUrl: payment.redirectUrl,
            paymentId: payment.id,
            referenceId,
        });
    } catch {
        return NextResponse.json({ error: "Create order failed" }, { status: 500 });
    }
}
