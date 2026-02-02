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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, currency = "EUR" } = await req.json();
        if (!Number.isFinite(amount) || amount < 1) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 422 });
        }

        const referenceId =
            "TOPUP-" +
            session.user.email +
            "-" +
            crypto.randomBytes(6).toString("hex");

        const payload = {
            referenceId,
            paymentType: "DEPOSIT",
            paymentMethod: "BASIC_CARD",
            amount,
            currency,
            description: `Token top-up for ${session.user.email}`,

            customer: {
                referenceId: `USER_${session.user.email}`,
                firstName: session.user.name ?? "User",
                lastName: "ShapeAI",
                email: session.user.email,
                locale: "en",
                ip: req.headers.get("x-forwarded-for") ?? "127.0.0.1",
            },

            successReturnUrl: `${SUCCESS_URL}?id={id}`,
            declineReturnUrl: `${DECLINE_URL}?id={id}`,
            webhookUrl: `${SITE_URL}/api/webhooks/transfermit`,
            websiteUrl: SITE_URL,
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
        const payment = data.result ?? data;

        if (!res.ok || !payment?.redirectUrl) {
            console.error("Transfermit error:", data);
            return NextResponse.json(
                { error: "Payment gateway error" },
                { status: 500 }
            );
        }

        return NextResponse.json({ redirectUrl: payment.redirectUrl });
    } catch (e) {
        console.error("Create order error:", e);
        return NextResponse.json({ error: "Create order failed" }, { status: 500 });
    }
}
