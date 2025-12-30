import { NextResponse } from "next/server";
import https from "https";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const amountMinor = Math.round(Number(body.amount) * 100); // 49 → 4900

        const payload = {
            project: process.env.BIZON_PROJECT,
            amount: amountMinor,
            currency: body.currency === "EUR" ? "EUR" : "GBP",
            description: body.description || "Top-up payment",
            client: {
                name: body.name || "Customer",
                email: body.email,
                phone: body.phone || "+380000000000",
            },
            options: {
                return_url: "https://shapeai.co.uk/payment-success",
                fail_url: "https://shapeai.co.uk/payment-failed",
                auto_charge: 1,
                form: "redirect",
                language: "en",
            },
        };

        const data = JSON.stringify(payload);

        const options: https.RequestOptions = {
            hostname: "api.bizon.one",
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
        };

        console.log("📦 Sending payload to Bizon:", payload);

        const redirectUrl = await new Promise<string>((resolve, reject) => {
            const r = https.request(options, (res) => {
                const location = res.headers.location as string | undefined;

                if (location) {
                    resolve(location);
                } else {
                    let body = "";
                    res.on("data", (c) => (body += c));
                    res.on("end", () => reject(new Error(body)));
                }
            });

            r.on("error", reject);
            r.write(data);
            r.end();
        });

        return NextResponse.json({ redirectUrl });
    } catch (err) {
        console.error("💥 Bizon error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}
