import { NextResponse } from "next/server";
import https from "https";
import crypto from "crypto";

export const runtime = "nodejs";

/* =======================
   Helpers
======================= */

function env(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v.trim();
}

/**
 * ✅ ЄДИНА ПРАВИЛЬНА НОРМАЛІЗАЦІЯ ПАРОЛЯ
 * - НЕ base64
 * - лише відновлення "+"
 */
function normalizePassphrase(raw: string): string {
    return raw.trim().replace(/ /g, "+");
}

/**
 * Завантаження сертифіката (.p12)
 */
function loadCertificate() {
    const pfx = Buffer.from(
        env("BIZON_CERT_P12_BASE64")
            .replace(/\n/g, "")
            .replace(/\r/g, ""),
        "base64"
    );

    const passphrase = normalizePassphrase(
        env("BIZON_CERT_PASSWORD")
    );

    return { pfx, passphrase };
}

function formatAmount(value: any): string {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) {
        throw new Error("Invalid amount");
    }
    return num.toFixed(2);
}

/* =======================
   API Handler
======================= */

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { pfx, passphrase } = loadCertificate();

        const payload = {
            amount: formatAmount(body.amount),
            currency: body.currency,
            description: body.description ?? "Top-up",
            merchant_order_id: crypto.randomUUID(),
            client: {
                name: body.name ?? "Customer",
                email: body.email ?? "customer@example.com",
                phone: body.phone ?? "+380000000000",
            },
            options: {
                return_url: env("BIZON_RETURN_URL"),
                auto_charge: 1,
                language: "en",
            },
        };

        const data = JSON.stringify(payload);

        const agent = new https.Agent({
            pfx,
            passphrase,
            keepAlive: false,
            maxSockets: 1,
            rejectUnauthorized: true,
        });

        const result = await new Promise<{
            status: number;
            headers: any;
            body: string;
        }>((resolve, reject) => {
            const r = https.request(
                {
                    hostname: "api.bizon.one",
                    port: 443,
                    path: "/orders/create",
                    method: "POST",
                    agent,
                    headers: {
                        Authorization:
                            "Basic " +
                            Buffer.from(
                                `${env("BIZON_USERNAME")}:${env("BIZON_API_PASSWORD")}`
                            ).toString("base64"),
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(data),
                        Connection: "close",
                    },
                    timeout: 15000,
                },
                (res) => {
                    let body = "";
                    res.on("data", (c) => (body += c));
                    res.on("end", () =>
                        resolve({
                            status: res.statusCode ?? 0,
                            headers: res.headers,
                            body,
                        })
                    );
                }
            );

            r.on("error", reject);
            r.write(data);
            r.end();
        });

        if (!result.headers?.location) {
            console.error("❌ BIZON RAW RESPONSE:", result.body);
            return NextResponse.json(
                {
                    error: "Bizon did not return redirect URL",
                    raw: result.body,
                },
                { status: 502 }
            );
        }

        return NextResponse.json({
            redirectUrl: result.headers.location,
        });
    } catch (e: any) {
        console.error("❌ BIZON ERROR:", e);
        return NextResponse.json(
            { error: e.message ?? "Internal error" },
            { status: 500 }
        );
    }
}
