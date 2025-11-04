import { DietType, RecipeCategory } from "src/generated/prisma";
import z from "zod";

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
	filters: z.object({
		category: recipeCategorySchema.optional(),
		diet: recipeDietSchema.optional(),
		search: z.string().optional(),
		ingredients: z.array(z.string()).optional(),
	}).optional(),
});

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

export const ListRecipesOutputSchema = z.object({
	recipes: z.array(RecipeDTOSchema),
	meta: z.object({
		total: z.number(),
		limit: z.number(),
		offset: z.number(),
	}),
})

export type ListRecipesInput = z.infer<typeof ListRecipesInputSchema>;
export type RecipeDto = z.infer<typeof RecipeDTOSchema>;
export type ListRecipesOutput = z.infer<typeof ListRecipesOutputSchema>;