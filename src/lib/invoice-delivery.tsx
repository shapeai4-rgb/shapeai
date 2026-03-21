import { render } from "@react-email/render";
import { Resend } from "resend";
import { deriveInvoiceNumber, renderInvoicePdfBuffer, type InvoicePdfData } from "../../InvoicePdf";
import { TopUpInvoiceEmail } from "@/components/emails/TopUpInvoiceEmail";

const SUPPORT_EMAIL = "info@shapeai.co.uk";

export type TopUpInvoicePayload = InvoicePdfData;

function buildInvoiceText(payload: TopUpInvoicePayload, invoiceNumber: string) {
  const amountLabel = `${payload.amount.toFixed(2)} ${payload.currency.toUpperCase()}`;

  return [
    `Hi ${payload.customerName},`,
    "",
    "Your ShapeAI invoice is attached.",
    `Invoice number: ${invoiceNumber}`,
    `Transaction reference: ${payload.transactionId}`,
    `Amount paid: ${amountLabel}`,
    "",
    "If you have any billing questions, contact info@shapeai.co.uk.",
  ].join("\n");
}

export async function sendTopUpInvoiceEmail(payload: TopUpInvoicePayload) {
  if (!payload.customerEmail) {
    console.warn("Invoice email skipped: customer email is missing.");
    return false;
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("Invoice email skipped: RESEND_API_KEY is not configured.");
    return false;
  }

  try {
    const invoiceNumber = deriveInvoiceNumber(payload.transactionId, payload.createdAt);
    const amountLabel = `${payload.amount.toFixed(2)} ${payload.currency.toUpperCase()}`;

    const [html, pdfBuffer] = await Promise.all([
      render(
        TopUpInvoiceEmail({
          amountLabel,
          customerName: payload.customerName,
          invoiceNumber,
          transactionId: payload.transactionId,
        })
      ),
      renderInvoicePdfBuffer(payload),
    ]);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
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
      subject: `ShapeAI invoice ${invoiceNumber}`,
      text: buildInvoiceText(payload, invoiceNumber),
      to: [payload.customerEmail],
    });

    if (error) {
      console.error("Invoice email failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invoice email failed:", error);
    return false;
  }
}
