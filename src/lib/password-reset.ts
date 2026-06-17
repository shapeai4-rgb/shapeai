import crypto from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { deliverySkipped, type EmailDeliveryResult } from "@/lib/email-delivery-result";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const DEFAULT_APP_URL = "https://shapeai.co.uk";
const SUPPORT_EMAIL = "info@shapeai.co.uk";
const DEFAULT_FROM_EMAIL = "accounts@shapeai.co.uk";
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

const copy: Record<Locale, { subject: string; title: string; body: string; cta: string; text: string }> = {
  en: {
    subject: "Reset your ShapeAI password",
    title: "Reset your password",
    body: "Use the button below to set a new password for your ShapeAI account. This link expires in 30 minutes.",
    cta: "Reset password",
    text: "Use this link to reset your ShapeAI password. It expires in 30 minutes:",
  },
  es: {
    subject: "Restablece tu contraseña de ShapeAI",
    title: "Restablece tu contraseña",
    body: "Usa el botón inferior para crear una nueva contraseña para tu cuenta de ShapeAI. Este enlace caduca en 30 minutos.",
    cta: "Restablecer contraseña",
    text: "Usa este enlace para restablecer tu contraseña de ShapeAI. Caduca en 30 minutos:",
  },
  de: {
    subject: "Setze dein ShapeAI-Passwort zurück",
    title: "Passwort zurücksetzen",
    body: "Nutze den Button unten, um ein neues Passwort für dein ShapeAI-Konto festzulegen. Dieser Link läuft in 30 Minuten ab.",
    cta: "Passwort zurücksetzen",
    text: "Nutze diesen Link, um dein ShapeAI-Passwort zurückzusetzen. Er läuft in 30 Minuten ab:",
  },
};

function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || DEFAULT_APP_URL;
  return appUrl.replace(/\/+$/, "");
}

function getFromAddress() {
  return process.env.REGISTRATION_FROM_EMAIL || process.env.EMAIL_FROM || DEFAULT_FROM_EMAIL;
}

export function hashPasswordResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildResetEmailHtml(resetUrl: string, locale: Locale) {
  const m = copy[locale] ?? copy.en;

  return `
    <div style="background:#ECFDF5;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E5E7EB;border-radius:24px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#047857,#10B981);color:#fff;padding:32px 40px;">
          <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">ShapeAI</p>
          <h1 style="margin:0;font-size:30px;line-height:1.2;">${m.title}</h1>
        </div>
        <div style="padding:32px 40px;color:#334155;">
          <p style="font-size:15px;line-height:1.7;">${m.body}</p>
          <p style="margin:28px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:#047857;color:#fff;border-radius:12px;padding:14px 22px;font-weight:700;text-decoration:none;">${m.cta}</a>
          </p>
          <p style="font-size:13px;line-height:1.7;color:#64748B;">If you did not request this, you can ignore this email or contact ${SUPPORT_EMAIL}.</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string, locale: Locale = DEFAULT_LOCALE): Promise<EmailDeliveryResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Password reset email skipped: RESEND_API_KEY is not configured.");
    return deliverySkipped("Password reset email skipped: RESEND_API_KEY is not configured.");
  }

  const m = copy[locale] ?? copy.en;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `ShapeAI Accounts <${getFromAddress()}>`,
      html: buildResetEmailHtml(resetUrl, locale),
      replyTo: SUPPORT_EMAIL,
      subject: m.subject,
      text: `${m.text}\n\n${resetUrl}`,
      to: [email],
    });

    if (error) {
      return {
        sent: false,
        error: typeof error.message === "string" ? error.message : "Password reset email failed.",
      };
    }

    return {
      sent: true,
      messageId: data?.id,
    };
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Password reset email failed.",
    };
  }
}

export async function createPasswordReset(email: string, locale: Locale = DEFAULT_LOCALE): Promise<EmailDeliveryResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { email: true, hashedPassword: true },
  });

  if (!user?.email || !user.hashedPassword) {
    return deliverySkipped("Password reset skipped: account not found or password login is unavailable.");
  }

  const rawToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashPasswordResetToken(rawToken);
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: { identifier: normalizedEmail },
  });

  await prisma.verificationToken.create({
    data: {
      expires,
      identifier: normalizedEmail,
      token: tokenHash,
    },
  });

  const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;
  return sendPasswordResetEmail(normalizedEmail, resetUrl, locale);
}
