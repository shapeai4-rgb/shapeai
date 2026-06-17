import { describe, expect, it } from "vitest";
import { extractTransfermitPayment, normalizeTransfermitState } from "@/lib/transfermit";

describe("normalizeTransfermitState", () => {
  it("treats COMPLETED as the only documented successful state", () => {
    expect(normalizeTransfermitState("COMPLETED")).toBe("completed");
    expect(normalizeTransfermitState("SUCCESS")).toBe("unknown");
  });

  it("classifies documented pending and failed states", () => {
    expect(normalizeTransfermitState("PENDING")).toBe("pending");
    expect(normalizeTransfermitState("CHECKOUT")).toBe("pending");
    expect(normalizeTransfermitState("RECONCILIATION")).toBe("pending");
    expect(normalizeTransfermitState("AWAITING_WEBHOOK")).toBe("pending");
    expect(normalizeTransfermitState("DECLINED")).toBe("failed");
    expect(normalizeTransfermitState("CANCELLED")).toBe("failed");
    expect(normalizeTransfermitState("ERROR")).toBe("failed");
    expect(normalizeTransfermitState("CHARGEBACK")).toBe("failed");
  });
});

describe("extractTransfermitPayment", () => {
  it("accepts raw callback bodies and wrapped payment bodies", () => {
    expect(extractTransfermitPayment({ id: "pay_1", state: "COMPLETED" })).toMatchObject({
      id: "pay_1",
      state: "COMPLETED",
    });
    expect(extractTransfermitPayment({ payment: { id: "pay_2", state: "PENDING" } })).toMatchObject({
      id: "pay_2",
      state: "PENDING",
    });
    expect(extractTransfermitPayment({ result: { id: "pay_3", state: "DECLINED" } })).toMatchObject({
      id: "pay_3",
      state: "DECLINED",
    });
  });
});
