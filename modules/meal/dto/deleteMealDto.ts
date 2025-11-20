import { z } from "zod";

export const deleteMealDto = z.object({
  id: z.uuid("Un identifiant est requis."),
});

export type DeleteMealDto = z.infer<typeof deleteMealDto>;
