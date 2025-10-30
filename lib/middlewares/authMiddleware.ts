import { Middleware } from "express-zod-api";

export const authMiddleware = new Middleware({
  handler: async ({ request, logger }) => {
    const apiKey = request.headers["x-api-key"];

    if (!apiKey || typeof apiKey !== "string") {
      throw new Error("API key is required in x-api-key header");
    }

    return { apiKey };
  },
});