import { NextResponse } from "next/server";
import https from "https";
import crypto from "crypto";

export const runtime = "nodejs"; // важливо: не edge

type CreateOrderBody = {
    amount: number;            // 9.99
    currency: "EUR" | "GBP" | "USD";
    description?: string;
    name?: string;
    email?: string;
    phone?: string;
};

function mustEnv(name: string) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

function toBasicAuth(user: string, pass: string) {
    return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

function toAmountString(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Invalid amount");
    // Bizon приклади: 9.99 (2 decimals)
    return amount.toFixed(2);
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CreateOrderBody;

        const BIZON_API_URL = mustEnv("BIZON_API_URL"); // https://api.bizon.one
        const BIZON_USERNAME = mustEnv("BIZON_USERNAME");
        const BIZON_API_PASSWORD = mustEnv("BIZON_API_PASSWORD");
        const BIZON_RETURN_URL = mustEnv("BIZON_RETURN_URL");

        // Сертифікат КРАЩЕ як base64 env (працює стабільно на Vercel)
        // Задай у Vercel: BIZON_CERT_P12_BASE64 = base64(твій .p12)
        const p12Base64 = mustEnv("BIZON_CERT_P12_BASE64");
        const passphrase = mustEnv("BIZON_CERT_PASSWORD");

        const url = new URL(BIZON_API_URL);
        const orderId = crypto.randomUUID();

        const payload = {
            amount: toAmountString(body.amount),
            currency: body.currency,
            description: body.description || `Top-up ${orderId}`,
            merchant_order_id: orderId, // твоє id
            client: {
                name: body.name || "Customer",
                email: body.email || "customer@example.com",
                phone: body.phone || "+380000000000",
            },
            options: {
                return_url: BIZON_RETURN_URL,
                auto_charge: 1,
                language: "en",
                // template/mobile/terminal/... додавай тільки якщо реально потрібно
            },
        };

        const data = JSON.stringify(payload);

        const options: https.RequestOptions = {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port ? Number(url.port) : 443,
            method: "POST",
            path: "/orders/create",

            // mTLS
            pfx: Buffer.from(p12Base64, "base64"),
            passphrase,

            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data),
                Authorization: toBasicAuth(BIZON_USERNAME, BIZON_API_PASSWORD),
                Connection: "close",
            },
        };

        const result = await new Promise<{ statusCode: number; headers: any; body: string }>(
            (resolve, reject) => {
                const r = https.request(options, (res) => {
                    let responseBody = "";
                    res.on("data", (chunk) => (responseBody += chunk));
                    res.on("end", () => {
                        resolve({
                            statusCode: res.statusCode || 0,
                            headers: res.headers,
                            body: responseBody,
                        });
                    });
                });

                r.on("error", reject);
                r.write(data);
                r.end();
            }
        );

        // Bizon: payment page URL у Location header, success code 201 :contentReference[oaicite:9]{index=9}
        const location = (result.headers?.location as string | undefined) || null;

        if (!location) {
            // якщо немає Location — віддай детальну помилку (щоб ти бачив відповідь Bizon)
            return NextResponse.json(
                {
                    error: "Bizon did not return Location header",
                    statusCode: result.statusCode,
                    responseBody: result.body,
                },
                { status: 502 }
            );
        }

        return NextResponse.json(
            {
                redirectUrl: location,
                merchantOrderId: orderId,
                statusCode: result.statusCode,
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}
