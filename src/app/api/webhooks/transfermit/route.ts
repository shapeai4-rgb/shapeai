import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { calculateTokens } from "@/lib/tokenCalculator";
import { sendTopUpInvoiceEmail } from "@/lib/invoice-delivery";

export const runtime = "nodejs";

function verifySignature(body: string, signature: string) {
    const secret = process.env.TRANSFERMIT_WEBHOOK_SECRET!;
    const hash = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
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

    const referenceId = payment.referenceId as string;
    const amount = Number(payment.amount);
    const currency = payment.currency;

    const email = referenceId.split("-")[1];
    if (!email) return NextResponse.json({ ok: true });

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) return NextResponse.json({ ok: true });

    const tokens = calculateTokens(amount, "custom");

    const transaction = await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: user.id },
            data: {
                tokenBalance: { increment: tokens },
            },
        });

        return tx.transaction.create({
            data: {
                userId: user.id,
                action: "topup",
                amount,
                currency,
                tokenAmount: tokens,
                description: "Transfermit top-up",
            },
        });
    });

    const customerEmail = user.email ?? email;

    await sendTopUpInvoiceEmail({
        amount,
        createdAt: transaction.createdAt,
        currency,
        customerEmail,
        customerName:
            user.name ??
            ([user.firstName, user.lastName].filter(Boolean).join(" ").trim() || customerEmail),
        description: transaction.description,
        tokens,
        transactionId: transaction.id,
    });

    return NextResponse.json({ ok: true });
}
