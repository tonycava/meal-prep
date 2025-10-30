import { Middleware } from "express-zod-api";

export const authMiddleware = new Middleware({
  handler: async ({ request, logger }) => {
    const apiKey = request.headers.authorization;
    return { apiKey: "test" };
  },
});