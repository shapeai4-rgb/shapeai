// src/app/api/bizon/create-order/route.ts
import { NextResponse } from "next/server";
import https from "https";

export const runtime = "nodejs";

/* ========= helpers ========= */

function env(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v.trim();
}

function formatAmount(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) {
        throw new Error("Invalid amount");
    }
    return n.toFixed(2);
}

function getClientIp(req: Request): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "1.1.1.1" // fallback, але не localhost
    );
}

function loadCert() {
    return {
        pfx: Buffer.from(
            env("BIZON_CERT_P12_BASE64").replace(/\s+/g, ""),
            "base64"
        ),
        passphrase: env("BIZON_CERT_PASSWORD"),
    };
}

/* ========= API ========= */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pfx, passphrase } = loadCert();

        const payload = {
            project: env("BIZON_PROJECT"),
            amount: formatAmount(body.amount),
            currency: body.currency ?? "EUR",
            description: body.description ?? "Top-up",

            client: {
                name: body.name ?? "Customer",
                email: body.email ?? "customer@example.com",
                phone: body.phone ?? "+380000000000",

                address: {
                    country: "GB",
                    city: "London",
                    street: "Unknown",
                    zip: "SW1A1AA",
                },

                location: {
                    ip: getClientIp(req),
                },
            },

            options: {
                return_url: env("BIZON_RETURN_URL"),
                fail_url: env("BIZON_FAIL_URL"),
                auto_charge: 1,
                form: "redirect",
                language: "en",
                force3d: 1, // 🔥 ВАЖЛИВО: number
            },
        };

        const data = JSON.stringify(payload);
        console.log("📦 Sending payload to Bizon:", data);

        const agent = new https.Agent({
            pfx,
            passphrase,
            rejectUnauthorized: true, // PROD
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
                    },
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

        const redirectUrl = result.headers?.location;

        if (!redirectUrl) {
            console.error("❌ BIZON RAW RESPONSE:", result.body);
            return NextResponse.json(
                { error: "No redirect", raw: result.body },
                { status: 502 }
            );
        }

        // 👉 ФРОНТ ДАЛІ РОБИТЬ:
        // window.location.href = redirectUrl

        return NextResponse.json({ redirectUrl });
    } catch (e: any) {
        console.error("💥 BIZON ERROR:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
