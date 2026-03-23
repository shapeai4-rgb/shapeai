import { beforeEach, describe, expect, it, vi } from "vitest";

const findUniqueMock = vi.fn();
const createMock = vi.fn();
const sendWelcomeEmailMock = vi.fn();
const hashMock = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
      create: createMock,
    },
  },
}));

vi.mock("@/lib/registration-confirmation", () => ({
  sendWelcomeEmail: sendWelcomeEmailMock,
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: hashMock,
  },
}));

describe("POST /api/register", () => {
  beforeEach(() => {
    hashMock.mockResolvedValue("hashed-password");
    sendWelcomeEmailMock.mockResolvedValue({ sent: true, messageId: "welcome_123" });
  });

  it("sends a welcome email after successful registration", async () => {
    findUniqueMock.mockResolvedValue(null);
    createMock.mockResolvedValue({
      id: "user_1",
      email: "new@example.com",
      firstName: "New",
      lastName: "User",
      name: "New User",
      tokenBalance: 10,
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        body: JSON.stringify({
          city: "Leeds",
          country: "United Kingdom",
          dateOfBirth: "1990-01-01",
          email: "new@example.com",
          firstName: "New",
          lastName: "User",
          password: "Secret123",
          phone: "+447000000000",
          postCode: "LS7 1DL",
          street: "12 Skinner Lane",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(sendWelcomeEmailMock).toHaveBeenCalledWith({
      email: "new@example.com",
      firstName: "New",
      lastName: "User",
      name: "New User",
      tokenBalance: 10,
    });
  });

  it("does not send a welcome email when the email already exists", async () => {
    findUniqueMock.mockResolvedValue({ id: "existing_user" });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        body: JSON.stringify({
          email: "existing@example.com",
          firstName: "Existing",
          lastName: "User",
          password: "Secret123",
        }),
      })
    );

    expect(response.status).toBe(400);
    expect(sendWelcomeEmailMock).not.toHaveBeenCalled();
  });
});
