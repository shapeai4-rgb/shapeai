import { beforeEach, describe, expect, it, vi } from "vitest";

const findUniqueTransactionMock = vi.fn();
const findUniqueUserMock = vi.fn();
const updateUserMock = vi.fn();
const createTransactionMock = vi.fn();
const transactionCallbackMock = vi.fn();
const sendInvoiceMock = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    transaction: {
      findUnique: findUniqueTransactionMock,
    },
    user: {
      findUnique: findUniqueUserMock,
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        transaction: {
          create: createTransactionMock,
        },
        user: {
          update: updateUserMock,
        },
      };

      transactionCallbackMock(tx);
      return callback(tx);
    }),
  },
}));

vi.mock("@/lib/invoice-delivery", () => ({
  sendTopUpInvoiceEmail: sendInvoiceMock,
}));

describe("completeTopUp", () => {
  beforeEach(() => {
    findUniqueUserMock.mockResolvedValue({
      email: "payer@example.com",
      firstName: "Payer",
      lastName: "User",
      name: "Payer User",
      tokenBalance: 10,
    });
    sendInvoiceMock.mockResolvedValue({ sent: true, messageId: "invoice_123" });
  });

  it("skips duplicate events based on externalRef", async () => {
    findUniqueTransactionMock.mockResolvedValue({
      id: "tx_existing",
      tokenAmount: 210,
    });
    findUniqueUserMock.mockResolvedValueOnce({
      tokenBalance: 420,
    });

    const { completeTopUp } = await import("../top-up");
    const result = await completeTopUp({
      amount: 19,
      currency: "EUR",
      externalRef: "transfermit:payment_123",
      planName: "Standard",
      planType: "standard",
      source: "transfermit",
      userId: "user_1",
    });

    expect(result.duplicate).toBe(true);
    expect(result.tokensAdded).toBe(210);
    expect(sendInvoiceMock).not.toHaveBeenCalled();
  });

  it("creates the transaction and sends the invoice for a new top-up", async () => {
    findUniqueTransactionMock.mockResolvedValue(null);
    updateUserMock.mockResolvedValue({
      tokenBalance: 220,
    });
    createTransactionMock.mockResolvedValue({
      createdAt: new Date("2026-03-24T10:00:00.000Z"),
      description: "Top-up: Standard",
      id: "tx_new",
    });

    const { completeTopUp } = await import("../top-up");
    const result = await completeTopUp({
      amount: 19,
      currency: "EUR",
      externalRef: "testmode:payment_123",
      planName: "Standard",
      planType: "standard",
      source: "test-mode",
      userId: "user_1",
    });

    expect(transactionCallbackMock).toHaveBeenCalledTimes(1);
    expect(createTransactionMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: "topup",
        description: "Top-up: Standard",
        externalRef: "testmode:payment_123",
        source: "test-mode",
        tokenAmount: 210,
      }),
    });
    expect(sendInvoiceMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      duplicate: false,
      newBalance: 220,
      tokensAdded: 210,
      transactionId: "tx_new",
    });
  });
});
