import { render } from "@react-email/render";
import { Resend } from "resend";
import { deriveInvoiceNumber, renderInvoicePdfBuffer, type InvoicePdfData } from "../../InvoicePdf";
import { TopUpInvoiceEmail } from "@/components/emails/TopUpInvoiceEmail";
import { deliverySkipped, type EmailDeliveryResult } from "@/lib/email-delivery-result";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { formatMessage, getMessages } from "@/i18n/messages";

const SUPPORT_EMAIL = "info@shapeai.co.uk";

export type TopUpInvoicePayload = InvoicePdfData;

function buildInvoiceText(payload: TopUpInvoicePayload, invoiceNumber: string, locale: Locale) {
  const amountLabel = `${payload.amount.toFixed(2)} ${payload.currency.toUpperCase()}`;
  const m = getMessages(locale).email.invoice;

  return [
    formatMessage(m.greeting, { name: payload.customerName }),
    "",
    m.attached,
    `${m.invoiceNumber}: ${invoiceNumber}`,
    `${m.transactionRef}: ${payload.transactionId}`,
    `${m.amountPaid}: ${amountLabel}`,
    "",
    m.billingQuestions,
  ].join("\n");
}

export async function sendTopUpInvoiceEmail(payload: TopUpInvoicePayload, locale: Locale = DEFAULT_LOCALE): Promise<EmailDeliveryResult> {
  if (!payload.customerEmail) {
    console.warn("Invoice email skipped: customer email is missing.");
    return deliverySkipped("Invoice email skipped: customer email is missing.");
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("Invoice email skipped: RESEND_API_KEY is not configured.");
    return deliverySkipped("Invoice email skipped: RESEND_API_KEY is not configured.");
  }

  try {
    const invoiceNumber = deriveInvoiceNumber(payload.transactionId, payload.createdAt);
    const amountLabel = `${payload.amount.toFixed(2)} ${payload.currency.toUpperCase()}`;
    const m = getMessages(locale).email.invoice;

    const [html, pdfBuffer] = await Promise.all([
      render(
        TopUpInvoiceEmail({
          amountLabel,
          customerName: payload.customerName,
          invoiceNumber,
          locale,
          transactionId: payload.transactionId,
        })
      ),
      renderInvoicePdfBuffer({ ...payload, locale }),
    ]);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      attachments: [
        {
          content: pdfBuffer,
          contentType: "application/pdf",
          filename: `${invoiceNumber}.pdf`,
        },
      ],
      from: `ShapeAI <${SUPPORT_EMAIL}>`,
      html,
      replyTo: SUPPORT_EMAIL,
      subject: formatMessage(m.subject, { invoiceNumber }),
      text: buildInvoiceText(payload, invoiceNumber, locale),
      to: [payload.customerEmail],
    });

    if (error) {
      console.error("Invoice email failed:", error);
      return {
        sent: false,
        error: typeof error.message === "string" ? error.message : "Invoice email failed.",
      };
    }

    return {
      sent: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Invoice email failed:", error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Invoice email failed.",
    };
  }
}
