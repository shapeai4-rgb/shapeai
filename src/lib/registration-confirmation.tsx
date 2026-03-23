import { render } from "@react-email/render";
import { Resend } from "resend";
import { RegistrationConfirmationEmail } from "@/components/emails/RegistrationConfirmationEmail";
import { deliverySkipped, type EmailDeliveryResult } from "@/lib/email-delivery-result";

const DEFAULT_APP_URL = "https://shapeai.co.uk";
const SUPPORT_EMAIL = "info@shapeai.co.uk";
const DEFAULT_FROM_EMAIL = "accounts@shapeai.co.uk";

export type RegistrationConfirmationUser = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  tokenBalance?: number | null;
};

function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || DEFAULT_APP_URL;
  return appUrl.replace(/\/+$/, "");
}

function getFromAddress() {
  return process.env.REGISTRATION_FROM_EMAIL || process.env.EMAIL_FROM || DEFAULT_FROM_EMAIL;
}

function getFirstName(user: RegistrationConfirmationUser) {
  const fullName = user.name?.trim();
  if (user.firstName?.trim()) return user.firstName.trim();
  if (fullName) return fullName.split(/\s+/)[0];
  return "there";
}

function formatCreatedAt(date: Date) {
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildWelcomeText(user: RegistrationConfirmationUser, createdAt: Date) {
  const appUrl = getAppUrl();
  const firstName = getFirstName(user);
  const dashboardUrl = `${appUrl}/dashboard`;
  const createdAtLabel = formatCreatedAt(createdAt);
  const tokenBalance = user.tokenBalance ?? 10;

  return [
    `Hi ${firstName},`,
    "",
    "Your ShapeAI account is now active.",
    "",
    `Registered email: ${user.email}`,
    `Starting balance: ${tokenBalance} tokens`,
    `Registered on: ${createdAtLabel}`,
    "",
    `Open your dashboard: ${dashboardUrl}`,
    "",
    `If this was not you, contact ${SUPPORT_EMAIL} immediately.`,
  ].join("\n");
}

export async function sendWelcomeEmail(
  user: RegistrationConfirmationUser,
  createdAt = new Date()
) : Promise<EmailDeliveryResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Welcome email skipped: RESEND_API_KEY is not configured.");
    return deliverySkipped("Welcome email skipped: RESEND_API_KEY is not configured.");
  }

  const appUrl = getAppUrl();
  const firstName = getFirstName(user);
  const tokenBalance = user.tokenBalance ?? 10;
  const dashboardUrl = `${appUrl}/dashboard`;

  try {
    const html = await render(
      RegistrationConfirmationEmail({
        dashboardUrl,
        email: user.email,
        firstName,
        supportEmail: SUPPORT_EMAIL,
        tokenBalance,
      })
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `ShapeAI Accounts <${getFromAddress()}>`,
      html,
      replyTo: SUPPORT_EMAIL,
      subject: "Your ShapeAI account is active",
      text: buildWelcomeText(user, createdAt),
      to: [user.email],
    });

    if (error) {
      console.error("Welcome email failed:", error);
      return {
        sent: false,
        error: typeof error.message === "string" ? error.message : "Welcome email failed.",
      };
    }

    return {
      sent: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Welcome email failed:", error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Welcome email failed.",
    };
  }
}
