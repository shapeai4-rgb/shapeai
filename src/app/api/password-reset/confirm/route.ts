import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken } from "@/lib/password-reset";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token || password.length < 8) {
      return NextResponse.json({ error: "Invalid reset request" }, { status: 400 });
    }

    const tokenHash = hashPasswordResetToken(token);
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token: tokenHash },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      if (resetToken) {
        await prisma.verificationToken.delete({
          where: { token: tokenHash },
        });
      }
      return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.identifier },
        data: { hashedPassword },
      }),
      prisma.verificationToken.delete({
        where: { token: tokenHash },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PASSWORD_RESET] Confirm failed:", error);
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}
