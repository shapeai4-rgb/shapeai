import crypto from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTopUpReference } from "@/lib/top-up-reference";

const completeTopUpMock = vi.fn();

vi.mock("@/lib/top-up", () => ({
  completeTopUp: completeTopUpMock,
}));

describe("POST /api/webhooks/transfermit", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.TRANSFERMIT_WEBHOOK_SECRET = "webhook_secret";
  });

  it("credits tokens and triggers invoicing only for successful payments", async () => {
    completeTopUpMock.mockResolvedValue({
      delivery: { sent: true, messageId: "invoice_123" },
      duplicate: false,
      externalRef: "transfermit:payment_123",
      newBalance: 220,
      tokensAdded: 210,
      transactionId: "tx_123",
    });

    const { POST } = await import("./route");
    const referenceId = createTopUpReference({
      amount: 19,
      currency: "EUR",
      nonce: "nonce_123",
      planName: "Standard",
      planType: "standard",
      userId: "user_1",
    });
    const payload = JSON.stringify({
      payment: {
        amount: 19,
        currency: "EUR",
        id: "payment_123",
        referenceId,
        state: "SUCCESS",
      },
    });
    const signature = crypto.createHmac("sha256", process.env.TRANSFERMIT_WEBHOOK_SECRET!).update(payload).digest("hex");

    const response = await POST(
      new Request("http://localhost/api/webhooks/transfermit", {
        body: payload,
        headers: {
          "x-transfermit-signature": signature,
        },
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    expect(completeTopUpMock).toHaveBeenCalledWith(
      expect.objectContaining({
        externalRef: "transfermit:payment_123",
        planName: "Standard",
        planType: "standard",
        source: "transfermit",
        userId: "user_1",
      })
    );
  });

  it("ignores non-success payment states", async () => {
    const { POST } = await import("./route");
    const payload = JSON.stringify({
      payment: {
        state: "DECLINED",
      },
    });
    const signature = crypto.createHmac("sha256", process.env.TRANSFERMIT_WEBHOOK_SECRET!).update(payload).digest("hex");

    const response = await POST(
      new Request("http://localhost/api/webhooks/transfermit", {
        body: payload,
        headers: {
          "x-transfermit-signature": signature,
        },
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    expect(completeTopUpMock).not.toHaveBeenCalled();
  });
});
