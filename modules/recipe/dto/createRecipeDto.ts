import { z } from "zod";
import { DietType, RecipeCategory, UnitType } from "../../../generated/client";

const recipeDietValues = Object.values(DietType) as [string, ...string[]];
const recipeDietSchema = z.enum(recipeDietValues);

const recipeCategoryValues = Object.values(RecipeCategory) as [string, ...string[]];
const recipeCategorySchema = z.enum(recipeCategoryValues);

const recipeIngredientUnitValues = Object.values(UnitType) as [string, ...string[]];
const recipeIngredientUnitSchema = z.enum(recipeIngredientUnitValues);

const ingredient = z.object({
	id: z.uuid().optional(),
	name: z.string().optional(),
	quantity: z.number().positive(),
	unit: recipeIngredientUnitSchema
}).refine(
	(data) => data.id || data.name,
	{ message: "Either 'id' or 'name' must be provided"}
);

export const createRecipeDto = z.object({
	title: z.string().min(1, "Field title must not be empty"),
	description: z.string().min(1, "Field description must not be empty"),
	instructions: z.string().min(1, "Field instructions must not be empty"),
	imageUrl: z.string().min(1, "Field image must not be empty"),
	prepTimeMin: z.number().optional(),
	cookTimeMin: z.number().optional(),
	servings: z.number().optional(),
	category: recipeCategorySchema.optional(),
	diet: recipeDietSchema.optional(),
	isPublic: z.boolean().optional(),
	ingredients: z
		.array(ingredient)
		.min(1, "Field ingredients must contain at least one ingredient"),
});

export type CreateRecipeDto = z.infer<typeof createRecipeDto>;
