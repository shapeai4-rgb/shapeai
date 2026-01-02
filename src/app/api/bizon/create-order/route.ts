import { NextResponse } from "next/server";
import https from "https";
import crypto from "crypto";
import fs from "fs";

const CERT_PATH = process.cwd() + "/certs/shapeai.p12";

export async function POST(req: Request) {
    try {
        /* ===================== PRECHECKS ===================== */
        console.log("🔍 Bizon mTLS precheck");
        console.log("CERT EXISTS:", fs.existsSync(CERT_PATH));
        if (!fs.existsSync(CERT_PATH)) {
            throw new Error("❌ CERT FILE NOT FOUND");
        }

        console.log("CERT SIZE:", fs.statSync(CERT_PATH).size);
        console.log("PROJECT:", process.env.BIZON_PROJECT);
        console.log("RETURN URL:", process.env.BIZON_RETURN_URL);
        console.log("FAIL URL:", process.env.BIZON_FAIL_URL);

        /* ===================== BODY ===================== */
        const body = await req.json();
        console.log("📥 Incoming body:", body);

        const payload = {
            project: process.env.BIZON_PROJECT!, // ⚠️ case-sensitive
            order_id: crypto.randomUUID(),
            amount: Math.trunc(Number(body.amount) * 100),
            currency: body.currency, // EUR | GBP
            description: body.description,
            client: {
                name: body.name,
                email: body.email,
                phone: body.phone || "+380000000000",
            },
            options: {
                return_url: process.env.BIZON_RETURN_URL!,
                fail_url: process.env.BIZON_FAIL_URL!,
                auto_charge: 1,
                form: "redirect",
                language: "en",
            },
        };

        console.log("📦 Bizon payload:", JSON.stringify(payload, null, 2));

        const data = JSON.stringify(payload);

        /* ===================== HTTPS OPTIONS ===================== */
        const options: https.RequestOptions = {
            hostname: "api.bizon.one",
            path: "/orders/create",
            method: "POST",

            // ✅ mTLS ONLY
            pfx: fs.readFileSync(CERT_PATH),
            passphrase: process.env.BIZON_CERT_PASSWORD,

            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data),
                "Connection": "close",
            },
        };

        console.log("🔐 HTTPS options prepared (mTLS)");

        /* ===================== REQUEST ===================== */
        const redirectUrl = await new Promise<string>((resolve, reject) => {
            const r = https.request(options, (res) => {
                console.log("📥 Bizon STATUS:", res.statusCode);
                console.log("📥 Bizon HEADERS:", res.headers);

                let responseBody = "";
                res.on("data", (chunk) => (responseBody += chunk));

                res.on("end", () => {
                    console.log("📥 Bizon RAW BODY:", responseBody);

                    const location = res.headers.location as string | undefined;

                    if (location) {
                        console.log("✅ REDIRECT URL:", location);
                        resolve(location);
                    } else {
                        reject(
                            new Error(
                                `Bizon error (${res.statusCode}): ${responseBody || "empty body"}`
                            )
                        );
                    }
                });
            });

            r.on("error", (err) => {
                console.error("❌ HTTPS REQUEST ERROR:", err);
                reject(err);
            });

            r.write(data);
            r.end();
        });

        return NextResponse.json({ redirectUrl });
    } catch (err) {
        console.error("💥 Bizon mTLS FINAL ERROR:", err);
        return NextResponse.json(
            {
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
