import React from "react";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import { RegistrationConfirmationEmail } from "@/components/emails/RegistrationConfirmationEmail";
import { RegistrationConfirmationPdf } from "@/components/pdf/RegistrationConfirmationPdf";

const DEFAULT_APP_URL = "https://shapeai.co.uk";
const SUPPORT_EMAIL = "info@shapeai.co.uk";

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

function getFirstName(user: RegistrationConfirmationUser) {
  const fullName = user.name?.trim();
  if (user.firstName?.trim()) return user.firstName.trim();
  if (fullName) return fullName.split(/\s+/)[0];
  return "there";
}

function getFullName(user: RegistrationConfirmationUser) {
  const fromParts = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (fromParts) return fromParts;
  return user.name?.trim() || getFirstName(user);
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
  const generatorUrl = `${appUrl}/`;
  const createdAtLabel = formatCreatedAt(createdAt);
  const tokenBalance = user.tokenBalance ?? 10;

  return [
    `Hi ${firstName},`,
    "",
    "Welcome to ShapeAI.",
    "Your account has been created successfully and is now active.",
    "",
    `Registered email: ${user.email}`,
    `Starting balance: ${tokenBalance} tokens`,
    `Registered on: ${createdAtLabel}`,
    "",
    `Dashboard: ${dashboardUrl}`,
    `Generator: ${generatorUrl}`,
    "",
    "Next steps:",
    "1. Open your dashboard.",
    "2. Generate your first personalised meal plan.",
    "3. Keep the attached registration PDF for your records.",
    "",
    `Support: ${SUPPORT_EMAIL}`,
  ].join("\n");
}

export async function createRegistrationConfirmationPdfBuffer(
  user: RegistrationConfirmationUser,
  createdAt = new Date()
) {
  const firstName = getFirstName(user);
  const fullName = getFullName(user);
  const tokenBalance = user.tokenBalance ?? 10;

  return renderToBuffer(
    <RegistrationConfirmationPdf
      createdAt={formatCreatedAt(createdAt)}
      email={user.email}
      firstName={firstName}
      fullName={fullName}
      tokenBalance={tokenBalance}
    />
  );
}

export async function sendWelcomeEmail(
  user: RegistrationConfirmationUser,
  createdAt = new Date()
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Welcome email skipped: RESEND_API_KEY is not configured.");
    return false;
  }

  const appUrl = getAppUrl();
  const firstName = getFirstName(user);
  const tokenBalance = user.tokenBalance ?? 10;
  const dashboardUrl = `${appUrl}/dashboard`;
  const generatorUrl = `${appUrl}/`;

  try {
    const [html, pdfBuffer] = await Promise.all([
      render(
        RegistrationConfirmationEmail({
          dashboardUrl,
          email: user.email,
          firstName,
          generatorUrl,
          supportEmail: SUPPORT_EMAIL,
          tokenBalance,
        })
      ),
      createRegistrationConfirmationPdfBuffer(user, createdAt),
    ]);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      attachments: [
        {
          content: pdfBuffer,
          contentType: "application/pdf",
          filename: "shapeai-registration-confirmation.pdf",
        },
      ],
      from: `ShapeAI <${SUPPORT_EMAIL}>`,
      html,
      replyTo: SUPPORT_EMAIL,
      subject: "Welcome to ShapeAI",
      text: buildWelcomeText(user, createdAt),
      to: [user.email],
    });

    if (error) {
      console.error("Welcome email failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Welcome email failed:", error);
    return false;
  }
}
