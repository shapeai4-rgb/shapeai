import crypto from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTopUpReference } from "@/lib/top-up-reference";

const processTransfermitPaymentMock = vi.fn();

vi.mock("@/lib/top-up-order", () => ({
  processTransfermitPayment: processTransfermitPaymentMock,
}));

describe("POST /api/webhooks/transfermit", () => {
  beforeEach(() => {
    vi.resetModules();
    processTransfermitPaymentMock.mockReset();
    process.env.TRANSFERMIT_WEBHOOK_SECRET = "webhook_secret";
  });

  it("processes documented raw COMPLETED callbacks", async () => {
    processTransfermitPaymentMock.mockResolvedValue({
      gatewayState: "COMPLETED",
      normalizedState: "completed",
      orderId: "order_123",
      paymentId: "payment_123",
      referenceId: "reference_123",
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
      amount: 19,
      currency: "EUR",
      id: "payment_123",
      referenceId,
      state: "COMPLETED",
    });
    const signature = crypto.createHmac("sha256", process.env.TRANSFERMIT_WEBHOOK_SECRET!).update(payload).digest("hex");

    const response = await POST(
      new Request("http://localhost/api/webhooks/transfermit", {
        body: payload,
        headers: {
          Signature: signature,
        },
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    expect(processTransfermitPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "payment_123", referenceId, state: "COMPLETED" }),
      { trigger: "webhook" }
    );
    await expect(response.json()).resolves.toMatchObject({ ok: true, status: "completed" });
  });

  it("passes PENDING states to the shared processor without completing in the route", async () => {
    processTransfermitPaymentMock.mockResolvedValue({
      gatewayState: "PENDING",
      normalizedState: "pending",
      orderId: "order_123",
      paymentId: "payment_123",
      referenceId: "reference_123",
    });

    const { POST } = await import("./route");
    const payload = JSON.stringify({
      payment: {
        id: "payment_123",
        referenceId: "reference_123",
        state: "PENDING",
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
    expect(processTransfermitPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({ state: "PENDING" }),
      { trigger: "webhook" }
    );
  });
});
