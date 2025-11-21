import { z } from "zod";

export const deleteRecipeDto = z.object({
  id: z.uuid("Un identifinat est requis."),
});

export type DeleteRecipeDto = z.infer<typeof deleteRecipeDto>;
