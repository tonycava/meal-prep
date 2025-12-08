import { z } from "zod";
import { createRecipeDto } from "./createRecipeDto";
import { DietType, RecipeCategory } from "../../../generated/client";

const recipeCategoryValues = Object.values(RecipeCategory) as [string, ...string[]];
const recipeDietValues = Object.values(DietType) as [string, ...string[]];
const recipeCategorySchema = z.enum(recipeCategoryValues);
const recipeDietSchema = z.enum(recipeDietValues);

export const updateRecipeDto = createRecipeDto.partial().extend({
	id: z.uuid("L'identifiant doit être un UUID valide."),
});

export const UpdateRecipeOutputSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	description: z.string(),
	instructions: z.string(),
	imageUrl: z.string().nullable(),
	prepTimeMin: z.number().nullable(),
	cookTimeMin: z.number().nullable(),
	servings: z.number().int(),
	category: recipeCategorySchema,
	diet: recipeDietSchema,
	isPublic: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	ingredients: z.array(
		z.object({
			id: z.uuid(),
			name: z.string(),
			quantity: z.number(),
			unit: z.string(),
		}),
	),
});

export type UpdateRecipeDto = z.infer<typeof updateRecipeDto>;
export type UpdateRecipeOutput = z.infer<typeof UpdateRecipeOutputSchema>;
