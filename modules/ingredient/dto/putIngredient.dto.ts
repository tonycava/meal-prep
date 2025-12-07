import { CreateIngredientDto } from "./ingredient.dto";
import { z } from "zod";

export const putIngredientDto = CreateIngredientDto.partial().extend({
	id: z.uuid("Identifier must be a valid UUID"),
});

export type PutIngredientDto = z.infer<typeof putIngredientDto>;