import { NextResponse } from "next/server";
import { createPasswordReset } from "@/lib/password-reset";
import { getLocaleFromRequest } from "@/i18n/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (email.includes("@")) {
      const delivery = await createPasswordReset(email, getLocaleFromRequest(request));
      console.info("[PASSWORD_RESET] Request processed:", {
        delivery,
        email,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PASSWORD_RESET] Request failed:", error);
    return NextResponse.json({ ok: true });
  }
}
