import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerSessionMock = vi.fn();
const getTransfermitPaymentMock = vi.fn();
const processTransfermitPaymentMock = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/transfermit", () => ({
  getTransfermitPayment: getTransfermitPaymentMock,
}));

vi.mock("@/lib/top-up-order", () => ({
  processTransfermitPayment: processTransfermitPaymentMock,
}));

describe("POST /api/bizon/reconcile", () => {
  beforeEach(() => {
    vi.resetModules();
    getServerSessionMock.mockResolvedValue({
      user: {
        id: "user_1",
      },
    });
    getTransfermitPaymentMock.mockReset();
    processTransfermitPaymentMock.mockReset();
  });

  it("checks Transfermit status and completes only through the shared processor", async () => {
    getTransfermitPaymentMock.mockResolvedValue({
      amount: 19,
      currency: "EUR",
      id: "payment_123",
      referenceId: "reference_123",
      state: "COMPLETED",
    });
    processTransfermitPaymentMock.mockResolvedValue({
      completion: {
        tokensAdded: 210,
        transactionId: "tx_123",
      },
      gatewayState: "COMPLETED",
      normalizedState: "completed",
      orderId: "order_123",
      paymentId: "payment_123",
      referenceId: "reference_123",
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/bizon/reconcile", {
        body: JSON.stringify({
          paymentId: "payment_123",
          referenceId: "reference_123",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    expect(getTransfermitPaymentMock).toHaveBeenCalledWith("payment_123");
    expect(processTransfermitPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "payment_123", state: "COMPLETED" }),
      { expectedUserId: "user_1", trigger: "reconcile" }
    );
    await expect(response.json()).resolves.toMatchObject({
      status: "completed",
      tokensAdded: 210,
      transactionId: "tx_123",
    });
  });

  it("returns pending without tokens when Transfermit has not finalized payment", async () => {
    getTransfermitPaymentMock.mockResolvedValue({
      id: "payment_123",
      referenceId: "reference_123",
      state: "PENDING",
    });
    processTransfermitPaymentMock.mockResolvedValue({
      gatewayState: "PENDING",
      normalizedState: "pending",
      orderId: "order_123",
      paymentId: "payment_123",
      referenceId: "reference_123",
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/bizon/reconcile", {
        body: JSON.stringify({
          paymentId: "payment_123",
          referenceId: "reference_123",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "pending",
      tokensAdded: null,
      transactionId: null,
    });
  });
});
