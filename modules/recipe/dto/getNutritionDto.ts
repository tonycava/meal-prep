import { z } from "zod";

export const getNutritionDto = z.object({
  id: z.uuid(),
});

export type GetNutritionDto = z.infer<typeof getNutritionDto>;