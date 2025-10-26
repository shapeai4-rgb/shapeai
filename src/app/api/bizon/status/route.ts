import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
        return NextResponse.json({ error: "No order ID" }, { status: 400 });
    }

    try {
        const res = await fetch(
            `${process.env.BIZON_API_URL}/orders/${orderId}?expand=card,operations`,
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            `${process.env.BIZON_USERNAME}:${process.env.BIZON_PASSWORD}`
                        ).toString("base64"),
                },
            }
        );

        const data = (await res.json()) as unknown;
        return NextResponse.json(data);
    } catch (err: unknown) {
        console.error("💥 Error checking status:", err);

        const message =
            err instanceof Error ? err.message : "Unknown error while checking status";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
