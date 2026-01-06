import { NextResponse } from "next/server";
import https from "https";

export const runtime = "nodejs";

function env(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v.trim();
}

function formatAmount(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) throw new Error("Invalid amount");
    return n.toFixed(2);
}

function getClientIp(req: Request): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "1.1.1.1"
    );
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const payload = {
            project: env("BIZON_PROJECT"),
            amount: formatAmount(body.amount),
            currency: body.currency ?? "EUR",
            description: body.description ?? "Token top-up",

            client: {
                name: body.name ?? "Customer",
                email: body.email ?? "customer@example.com",
                phone: body.phone ?? "+380000000000",
                location: { ip: getClientIp(req) },
            },

            options: {
                return_url: env("BIZON_RETURN_URL"),
                fail_url: env("BIZON_FAIL_URL"),
                auto_charge: 1,
                form: "redirect",
                language: "en",
                force3d: 1,
            },
        };

        const data = JSON.stringify(payload);

        const agent = new https.Agent({
            pfx: Buffer.from(
                env("BIZON_CERT_P12_BASE64").replace(/\s+/g, ""),
                "base64"
            ),
            passphrase: env("BIZON_CERT_PASSWORD"),
            rejectUnauthorized: true,
        });

        const result = await new Promise<any>((resolve, reject) => {
            const r = https.request(
                {
                    hostname: "api.bizon.one",
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
                    resolve({ headers: res.headers });
                }
            );

            r.on("error", reject);
            r.write(data);
            r.end();
        });

        if (!result.headers?.location) {
            throw new Error("No redirect from Bizon");
        }

        return NextResponse.json({ redirectUrl: result.headers.location });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
