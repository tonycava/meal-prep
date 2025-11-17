import z from "zod";
import { DietType, RecipeCategory } from "@prisma/client";

const recipeCategoryValues = Object.values(RecipeCategory) as [string, ...string[]];
const recipeDietValues = Object.values(DietType) as [string, ...string[]];

const recipeCategorySchema = z.enum(recipeCategoryValues);
const recipeDietSchema = z.enum(recipeDietValues)

export interface IRecipeFilters {
	category?: (typeof recipeCategoryValues)[number],
	diet?: (typeof recipeDietValues)[number],
	ingredients?: string[],
	search?: string,
}

export const ListRecipesInputSchema = z.object({
	limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
	offset: z.string().optional().transform((val) => val ? parseInt(val, 10) : 0),
	category: recipeCategorySchema.optional(),
	diet: recipeDietSchema.optional(),
	search: z.string().optional(),
	ingredients: z.union([
		z.string().transform(val => val.split(',')),
		z.array(z.string())
	]).optional(),
});

export const GetRecipeByIdInputSchema = z.object({
	id: z.uuid({
		message: "Invalid recipe ID format",
	}),
	apiKey: z.string(),
})

export const RecipeDTOSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	description: z.string(),
	imageUrl: z.string().nullable(),
	prepTimeMin: z.number(),
	cookTimeMin: z.number(),
	servings: z.number().int(),
	isPublic: z.boolean(),
	category: recipeCategorySchema,
	diet: recipeDietSchema,
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const RecipeDetailDTOSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	description: z.string(),
	imageUrl: z.string().nullable(),
	prepTimeMin: z.number(),
	cookTimeMin: z.number(),
	servings: z.number().int(),
	isPublic: z.boolean(),
	category: recipeCategorySchema,
	diet: recipeDietSchema,
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	ingredients: z.array(z.object({
		id: z.uuid(),
		name: z.string(),
		quantity: z.number(),
		unit: z.string(),
		notes: z.string(),
		category: z.string(),
		calories: z.number(),
		proteins: z.number(),
		fats: z.number(),
		carbs: z.number(),
	})),
	steps: z.array(z.object({
		id: z.uuid(),
		order: z.number().int(),
		instruction: z.string(),
		durationMin: z.number().int().nullable(),
	})),
	mealCount: z.number().int(),
})

export const ListRecipesOutputSchema = z.object({
	recipes: z.array(RecipeDTOSchema),
	meta: z.object({
		total: z.number(),
		limit: z.number(),
		offset: z.number(),
	}),
})

export const GetRecipeByIdOutputSchema = z.object({
	recipe: RecipeDetailDTOSchema,
})

export type ListRecipesInput = z.infer<typeof ListRecipesInputSchema>;
export type RecipeDto = z.infer<typeof RecipeDTOSchema>;
export type ListRecipesOutput = z.infer<typeof ListRecipesOutputSchema>;

export type GetRecipeByIdInput = z.infer<typeof GetRecipeByIdInputSchema>;
export type RecipeDetailDto = z.infer<typeof RecipeDetailDTOSchema>;
export type GetRecipeByIdOutput = z.infer<typeof GetRecipeByIdOutputSchema>;