import { render } from "@react-email/render";
import { Resend } from "resend";
import { RegistrationConfirmationEmail } from "@/components/emails/RegistrationConfirmationEmail";
import { deliverySkipped, type EmailDeliveryResult } from "@/lib/email-delivery-result";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { formatLocalizedDateTime } from "@/i18n/server";
import { formatMessage, getMessages } from "@/i18n/messages";

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

function buildWelcomeText(user: RegistrationConfirmationUser, createdAt: Date, locale: Locale) {
  const appUrl = getAppUrl();
  const firstName = getFirstName(user);
  const dashboardUrl = `${appUrl}/dashboard`;
  const createdAtLabel = formatLocalizedDateTime(createdAt, locale);
  const tokenBalance = user.tokenBalance ?? 10;
  const m = getMessages(locale).email.registration;

  return [
    formatMessage("Hi {name},", { name: firstName }),
    "",
    m.created,
    "",
    `${m.registeredEmail}: ${user.email}`,
    `${m.startingBalance}: ${tokenBalance} tokens`,
    `${m.registeredOn}: ${createdAtLabel}`,
    "",
    `${m.dashboard}: ${dashboardUrl}`,
    "",
    formatMessage(m.footer, { email: SUPPORT_EMAIL }),
  ].join("\n");
}

export async function sendWelcomeEmail(
  user: RegistrationConfirmationUser,
  createdAt = new Date(),
  locale: Locale = DEFAULT_LOCALE
) : Promise<EmailDeliveryResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Welcome email skipped: RESEND_API_KEY is not configured.");
    return deliverySkipped("Welcome email skipped: RESEND_API_KEY is not configured.");
  }

  const appUrl = getAppUrl();
  const firstName = getFirstName(user);
  const tokenBalance = user.tokenBalance ?? 10;
  const dashboardUrl = `${appUrl}/dashboard`;
  const m = getMessages(locale).email.registration;

  try {
    const html = await render(
      RegistrationConfirmationEmail({
        dashboardUrl,
        email: user.email,
        firstName,
        locale,
        supportEmail: SUPPORT_EMAIL,
        tokenBalance,
      })
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `ShapeAI Accounts <${getFromAddress()}>`,
      html,
      replyTo: SUPPORT_EMAIL,
      subject: m.subject,
      text: buildWelcomeText(user, createdAt, locale),
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
