import { z } from "zod";

export const deleteRecipeDto = z.object({
  id: z.uuid("An id is required"),
});

export type DeleteRecipeDto = z.infer<typeof deleteRecipeDto>;
