import { NextResponse } from "next/server";
import https from "https";
import fs from "fs";

const BIZON_CERT_PATH = process.cwd() + "/certs/shapeai.p12";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = JSON.stringify({
            project: process.env.BIZON_PROJECT,
            amount: body.amount,
            currency: body.currency || "USD",
            description: body.description || "Top-up payment",
            client: {
                name: body.name || "Customer",
                email: body.email || "client@example.com",
                phone: body.phone || "+380000000000",
            },
            options: {
                return_url: process.env.BIZON_RETURN_URL,
                fail_url: process.env.BIZON_FAIL_URL,
                auto_charge: 1,
                form: "redirect",
                language: "en",
            },
        });

        const options: https.RequestOptions = {
            hostname: "sandboxapi.bizon.one",
            path: "/orders/create",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${process.env.BIZON_USERNAME}:${process.env.BIZON_PASSWORD}`
                    ).toString("base64"),
            },
            pfx: fs.readFileSync(BIZON_CERT_PATH),
            passphrase: process.env.BIZON_CERT_PASSWORD,
            rejectUnauthorized: false, // тільки для sandbox
        };

        console.log("📦 Sending payload to Bizon:", data);

        const redirectUrl = await new Promise<string>((resolve, reject) => {
            const reqHttps = https.request(options, (res) => {
                const location = res.headers["location"] as string | undefined;
                console.log("📬 Bizon response:", res.statusCode, res.headers);

                if (location) {
                    resolve(location);
                } else {
                    let responseBody = "";
                    res.on("data", (chunk) => (responseBody += chunk));
                    res.on("end", () => reject(new Error(responseBody)));
                }
            });

            reqHttps.on("error", (e) => reject(e));
            reqHttps.write(data);
            reqHttps.end();
        });

        console.log("✅ Redirect URL:", redirectUrl);
        return NextResponse.json({ redirectUrl });
    } catch (err) {
        console.error("💥 Bizon order create error:", err);

        // Без any, перевіряємо тип через instanceof
        const message =
            err instanceof Error ? err.message : "Unknown error creating order";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
