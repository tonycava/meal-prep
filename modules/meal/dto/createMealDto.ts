import { z } from "zod";
import { MealType } from "@prisma/client";

const RecipeMeal = z.object({
  id: z.string(),
  recipeId: z.string(),
  mealId: z.string(),
  type: z.enum(Object.values(MealType) as [string, ...string[]]),
})

export const createMealDto = z.object({
  mealType: z.enum(Object.values(MealType) as [string, ...string[]]),
  recipeMeals: z.array(RecipeMeal),
})

export type CreateMealDto = z.infer<typeof createMealDto>;
