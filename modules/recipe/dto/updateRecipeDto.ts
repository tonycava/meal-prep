import { z } from "zod";
import { createRecipeDto } from "./createRecipeDto";

export const updateRecipeDto = createRecipeDto.partial().extend({
	id: z.uuid("L'identifiant doit être un UUID valide."),
});

export type UpdateRecipeDto = z.infer<typeof updateRecipeDto>;
