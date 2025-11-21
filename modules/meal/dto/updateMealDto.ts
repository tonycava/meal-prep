import { z } from "zod";
import { createMealDto } from "./createMealDto";

export const updateMealDto = createMealDto.partial().extend({
  id: z.uuid("L'identifiant doit être un UUID valide."),
});

export type UpdateMealDto = z.infer<typeof updateMealDto>;
