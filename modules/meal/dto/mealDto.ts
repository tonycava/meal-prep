import z from "zod";
import { MealType } from "../../../src/generated/prisma";

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
  apiKey: z.string(),
});

export const MealDTOSchema = z.object({
  id: z.uuid(),
  mealType: mealTypeSchema,
  recipeMeals: z.array(
    z.object({
      recipeId: z.string(),
      type: z.string(),
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

export const GetMealByIdOutputSchema = z.object({
  meal: MealDTOSchema,
});

export type ListMealsInput = z.infer<typeof ListMealsInputSchema>;
export type MealDto = z.infer<typeof MealDTOSchema>;
export type ListMealsOutput = z.infer<typeof ListMealsOutputSchema>;
export type GetMealByIdInput = z.infer<typeof GetMealByIdInputSchema>;
export type GetMealByIdOutput = z.infer<typeof GetMealByIdOutputSchema>;
