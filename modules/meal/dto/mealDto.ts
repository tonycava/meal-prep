import z from "zod";
import { MealType } from "../../../generated/client";

const mealTypeValues = Object.values(MealType);

const mealTypeSchema = z.enum(mealTypeValues as [string, ...string[]]);

export interface IMealFilters {
  mealType?: (typeof mealTypeValues)[number];
  search?: string;
}

export const ListMealsInputSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0)),
  mealType: mealTypeSchema.optional(),
  search: z.string().optional(),
});

export const GetMealByIdInputSchema = z.object({
  id: z.uuid({
    message: "Invalid meal ID format",
  }),
});

export const MealDTOSchema = z.object({
  id: z.uuid(),
  mealType: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  recipeMeals: z.array(
    z.object({
      recipeId: z.string(),
      type: z.number(),
    })
  ),
});

export const ListMealsOutputSchema = z.object({
  meals: z.array(MealDTOSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
});

export const SingleMealOutputSchema = z.object({
  meals: z.array(MealDTOSchema),
});

export const GetMealByIdOutputSchema = z.object({
  meal: MealDTOSchema,
});

export const RecipeDTOSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  instructions: z.string(),
  imageUrl: z.string().nullable(),
  prepTimeMin: z.number(),
  cookTimeMin: z.number(),
  servings: z.number(),
  category: z.string(),
  diet: z.string(),
  isPublic: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  recipeIngredient: z.array(
    z.object({
      ingredientId: z.string(),
      quantity: z.number(),
      unit: z.string(),
      notes: z.string().nullable(),
    })
  ),
});

export const RecipeListOutputSchema = z.object({
  recipes: z.array(RecipeDTOSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
});

export const SingleRecipeOutputSchema = z.object({
  recipes: z.array(RecipeDTOSchema),
  meta: z.object({
    total: z.literal(1),
    offset: z.literal(0),
    limit: z.literal(1),
  }),
});

export type ListMealsInput = z.infer<typeof ListMealsInputSchema>;
export type MealDto = z.infer<typeof MealDTOSchema>;
export type ListMealsOutput = z.infer<typeof ListMealsOutputSchema>;
export type GetMealByIdInput = z.infer<typeof GetMealByIdInputSchema>;
export type SingleMealOutput = z.infer<typeof SingleMealOutputSchema>;
export type GetMealByIdOutput = z.infer<typeof GetMealByIdOutputSchema>;
export type RecipeDto = z.infer<typeof RecipeDTOSchema>;
export type RecipeListOutput = z.infer<typeof RecipeListOutputSchema>;
export type SingleRecipeOutput = z.infer<typeof SingleRecipeOutputSchema>;
