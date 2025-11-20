import "dotenv/config";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});
