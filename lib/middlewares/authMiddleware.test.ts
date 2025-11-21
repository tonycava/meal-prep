import { expect, it, describe, vi, beforeEach } from "vitest";
import { testMiddleware } from "express-zod-api";
import { authMiddleware } from "./authMiddleware";

vi.mock("../db", () => ({
  prisma: {
    apiKey: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../db";

describe("AuthMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail when no API key provided", async () => {
    const { responseMock } = await testMiddleware({
      middleware: authMiddleware,
    });

    const data = responseMock._getJSONData();
    expect(data.status).toBe("error");
    expect(data.error.message).toBe(
      "API key is required in 'x-api-key' header",
    );
  });

  it("should fail when API key does not exist", async () => {
    const { responseMock } = await testMiddleware({
      middleware: authMiddleware,
      requestProps: {
        headers: { "x-api-key": "invalid-key" },
      },
    });

    const data = responseMock._getJSONData();
    expect(data.status).toBe("error");
    expect(data.error.message).toBe("Invalid API key");
  });

  it("should work with valid API key", async () => {
    (prisma.apiKey.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "test",
      name: "test",
      key: "550e8400-e29b-41d4-a716-446655440000",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      expiresAt: new Date(),
    });

    const { responseMock } = await testMiddleware({
      middleware: authMiddleware,
      requestProps: {
        headers: { "x-api-key": "550e8400-e29b-41d4-a716-446655440000" },
      },
    });

    const data = responseMock._getData();
    expect(data).toBe("");
  });
});
