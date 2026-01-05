// src/app/api/bizon/create/route.ts
import { NextResponse } from "next/server";
import https from "https";
import crypto from "crypto";

export const runtime = "nodejs"; // ❗ ОБОВʼЯЗКОВО

type CreateOrderBody = {
    amount: number;
    currency: "EUR" | "GBP" | "USD";
    description?: string;
    name?: string;
    email?: string;
    phone?: string;
};

function mustEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

function basicAuth(user: string, pass: string) {
    return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

function amountToString(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }
    return amount.toFixed(2); // Bizon строго 2 знаки
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CreateOrderBody;

        const API_URL = mustEnv("BIZON_API_URL"); // https://api.bizon.one
        const USERNAME = mustEnv("BIZON_USERNAME");
        const PASSWORD = mustEnv("BIZON_API_PASSWORD");
        const RETURN_URL = mustEnv("BIZON_RETURN_URL");

        const CERT_BASE64 = mustEnv("BIZON_CERT_P12_BASE64");
        const CERT_PASSWORD = mustEnv("BIZON_CERT_PASSWORD");

        const url = new URL(API_URL);
        const orderId = crypto.randomUUID();

        const payload = {
            amount: amountToString(body.amount),
            currency: body.currency,
            description: body.description || `Top-up ${orderId}`,
            merchant_order_id: orderId,
            client: {
                name: body.name || "Customer",
                email: body.email || "customer@example.com",
                phone: body.phone || "+380000000000",
            },
            options: {
                return_url: RETURN_URL,
                auto_charge: 1,
                language: "en",
            },
        };

        const data = JSON.stringify(payload);

        const agent = new https.Agent({
            pfx: Buffer.from(CERT_BASE64, "base64"),
            passphrase: CERT_PASSWORD,
            keepAlive: false, // ❗ КРИТИЧНО
            maxSockets: 1,
        });

        const requestOptions: https.RequestOptions = {
            protocol: url.protocol,
            hostname: url.hostname,
            port: 443,
            path: "/orders/create",
            method: "POST",
            agent,
            headers: {
                Authorization: basicAuth(USERNAME, PASSWORD),
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data),
                Connection: "close",
            },
            timeout: 15000,
        };

        const result = await new Promise<{
            statusCode: number;
            headers: any;
            body: string;
        }>((resolve, reject) => {
            const r = https.request(requestOptions, (res) => {
                let body = "";
                res.on("data", (c) => (body += c));
                res.on("end", () => {
                    resolve({
                        statusCode: res.statusCode || 0,
                        headers: res.headers,
                        body,
                    });
                });
            });

            r.on("error", reject);
            r.write(data);
            r.end();
        });

        const redirectUrl = result.headers?.location;

        if (!redirectUrl) {
            return NextResponse.json(
                {
                    error: "Bizon error",
                    statusCode: result.statusCode,
                    response: result.body,
                },
                { status: 502 }
            );
        }

        return NextResponse.json({
            redirectUrl,
            merchantOrderId: orderId,
        });
    } catch (e: any) {
        console.error("BIZON ERROR:", e);
        return NextResponse.json(
            { error: e.message || "Internal error" },
            { status: 500 }
        );
    }
}
