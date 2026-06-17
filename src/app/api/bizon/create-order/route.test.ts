import { beforeEach, describe, expect, it, vi } from "vitest";

const completeTopUpMock = vi.fn();
const createTopUpOrderMock = vi.fn();
const createTransfermitPaymentMock = vi.fn();
const getServerSessionMock = vi.fn();
const getSuccessRedirectMock = vi.fn((tokensAdded: number) => `http://localhost:3000/dashboard?payment_success=true&tokens_added=${tokensAdded}`);
const isWithoutPaymentEnabledMock = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/top-up", () => ({
  completeTopUp: completeTopUpMock,
  getTopUpSuccessRedirect: getSuccessRedirectMock,
}));

vi.mock("@/lib/payment-mode", () => ({
  isWithoutPaymentEnabled: isWithoutPaymentEnabledMock,
}));

vi.mock("@/lib/top-up-order", () => ({
  createTopUpOrder: createTopUpOrderMock,
}));

vi.mock("@/lib/transfermit", () => ({
  createTransfermitPayment: createTransfermitPaymentMock,
}));

vi.mock("@/lib/top-up-reference", () => ({
  createTopUpReference: vi.fn(() => "shapeai-topup:test-reference"),
}));

describe("POST /api/bizon/create-order", () => {
  beforeEach(() => {
    vi.resetModules();
    createTopUpOrderMock.mockReset();
    createTransfermitPaymentMock.mockReset();
    process.env.TRANSFERMIT_API_URL = "https://gateway.test";
    process.env.TRANSFERMIT_API_KEY = "gateway_key";
    process.env.TRANSFERMIT_WEBSITE_URL = "https://shapeai.co.uk";
    process.env.TRANSFERMIT_SUCCESS_URL = "https://shapeai.co.uk/payment-success";
    process.env.TRANSFERMIT_DECLINE_URL = "https://shapeai.co.uk/payment-failed";

    getServerSessionMock.mockResolvedValue({
      user: {
        email: "payer@example.com",
        id: "user_1",
        name: "Payer User",
      },
    });
  });

  it("credits tokens immediately in test mode", async () => {
    isWithoutPaymentEnabledMock.mockReturnValue(true);
    completeTopUpMock.mockResolvedValue({
      delivery: { sent: true, messageId: "invoice_123" },
      duplicate: false,
      externalRef: "testmode:abc",
      newBalance: 220,
      tokensAdded: 210,
      transactionId: "tx_123",
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/bizon/create-order", {
        method: "POST",
        body: JSON.stringify({
          amount: 19,
          currency: "EUR",
          planName: "Standard",
          planType: "standard",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(completeTopUpMock).toHaveBeenCalledTimes(1);
    await expect(response.json()).resolves.toMatchObject({
      mode: "bypass",
      tokensAdded: 210,
    });
  });

  it("returns a gateway redirect when payment mode is live", async () => {
    isWithoutPaymentEnabledMock.mockReturnValue(false);
    createTransfermitPaymentMock.mockResolvedValue({
      id: "payment_123",
      redirectUrl: "https://gateway.test/checkout/payment_123",
      state: "PENDING",
    });
    createTopUpOrderMock.mockResolvedValue({ id: "order_123" });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/bizon/create-order", {
        method: "POST",
        body: JSON.stringify({
          amount: 49,
          currency: "EUR",
          planName: "Pro",
          planType: "pro",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(completeTopUpMock).not.toHaveBeenCalled();
    expect(createTransfermitPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pendingReturnUrl: "https://shapeai.co.uk/payment-success?id={id}&ref={referenceId}&state={state}",
        referenceId: "shapeai-topup:test-reference",
        webhookUrl: "https://shapeai.co.uk/api/webhooks/transfermit",
      })
    );
    expect(createTopUpOrderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        gatewayState: "PENDING",
        referenceId: "shapeai-topup:test-reference",
        transfermitPaymentId: "payment_123",
        userId: "user_1",
      })
    );
    await expect(response.json()).resolves.toMatchObject({
      mode: "gateway",
      redirectUrl: "https://gateway.test/checkout/payment_123",
    });
  });
});
