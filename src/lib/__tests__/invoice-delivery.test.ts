import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEmailMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: sendEmailMock,
    };
  },
}));

vi.mock("@react-email/render", () => ({
  render: vi.fn(async () => "<html><body>invoice</body></html>"),
}));

vi.mock("../../../InvoicePdf", () => ({
  deriveInvoiceNumber: vi.fn(() => "INV-20260324-ABC123"),
  renderInvoicePdfBuffer: vi.fn(async () => Buffer.from("pdf-binary")),
}));

vi.mock("@/components/emails/TopUpInvoiceEmail", () => ({
  TopUpInvoiceEmail: vi.fn(() => null),
}));

describe("sendTopUpInvoiceEmail", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test_key";
    sendEmailMock.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });
  });

  it("sends the invoice email with a PDF attachment", async () => {
    const { sendTopUpInvoiceEmail } = await import("../invoice-delivery");

    const result = await sendTopUpInvoiceEmail({
      amount: 19,
      createdAt: new Date("2026-03-24T10:00:00.000Z"),
      currency: "EUR",
      customerEmail: "test@example.com",
      customerName: "Test User",
      description: "Top-up: Standard",
      tokens: 210,
      transactionId: "tx_123",
    });

    expect(result).toEqual({
      sent: true,
      messageId: "email_123",
    });
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock.mock.calls[0][0]).toMatchObject({
      subject: "ShapeAI invoice INV-20260324-ABC123",
      to: ["test@example.com"],
    });
    expect(sendEmailMock.mock.calls[0][0].attachments).toHaveLength(1);
    expect(sendEmailMock.mock.calls[0][0].attachments[0]).toMatchObject({
      contentType: "application/pdf",
      filename: "INV-20260324-ABC123.pdf",
    });
  });
});
