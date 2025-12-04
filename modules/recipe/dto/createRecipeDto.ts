import { z } from "zod";
import { DietType, UnitType } from "src/generated/prisma";

const recipeDietValues = Object.values(DietType) as [string, ...string[]];
const recipeDietSchema = z.enum(recipeDietValues);

const recipeIngredientUnitValues = Object.values(UnitType) as [string, ...string[]];
const recipeIngredientUnitSchema = z.enum(recipeIngredientUnitValues);

const ingredient = z.object({
	id: z.string(),
	quantity: z.number(),
	unit: recipeIngredientUnitSchema.optional()
});

export const createRecipeDto = z.object({
	title: z.string().min(1, "Field title must not be empty"),
	description: z.string().min(1, "Field description must not be empty"),
	isPublic: z.boolean().optional(),
	instructions: z.string().min(1, "Field instructions must not be empty"),

	diet: recipeDietSchema.optional(),
	ingredients: z
		.array(ingredient)
		.nonempty("At least one ingredient is required"),
	image: z.string().min(1, "Field image must not be empty"),
	prepTimeMin: z.number().optional(),
	cookTimeMin: z.number().optional(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeDto>;
