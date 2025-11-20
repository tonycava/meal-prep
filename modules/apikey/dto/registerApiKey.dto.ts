import { z } from "zod";

export const RegisterApiKeyInputSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.email("Invalid email format").optional(),
});

export type RegisterApiKeyInput = z.infer<typeof RegisterApiKeyInputSchema>;
