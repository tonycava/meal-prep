import { Middleware } from "express-zod-api";
import { prisma } from "$lib/db";

export const authMiddleware = new Middleware({
  handler: async ({ request, logger }) => {
    const apiKey = request.headers["x-api-key"];

    if (!apiKey || typeof apiKey !== "string") {
      throw new Error("API key is required in x-api-key header");
    }

    // Vérifier que l'API key existe et est active
    const existingKey = await prisma.apiKey.findUnique({
      where: { key: apiKey }
    });

    if (!existingKey) {
      throw new Error("Invalid API key");
    }

    if (!existingKey.isActive) {
      throw new Error("API key is inactive");
    }

    return { apiKey };
  },
});