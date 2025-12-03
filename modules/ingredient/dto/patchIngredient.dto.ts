import { z } from "zod";
import { CreateIngredientDto } from "./ingredient.dto";

export const patchIngredientDto = CreateIngredientDto.partial().extend({
	id: z.uuid("L'identifiant doit être un UUID valide."),
});

export type PatchIngredientDtoType = z.infer<typeof patchIngredientDto>;
