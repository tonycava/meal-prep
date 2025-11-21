import { z } from "zod";
import { MealType } from "../../../src/generated/prisma";

const RecipeMeal = z.object({
  id: z.string(),
  recipeId: z.string(),
  mealId: z.string(),
  type: z.enum(Object.values(MealType) as [string, ...string[]]),
});

export const createMealDto = z.object({
  mealType: z.string().transform((val) => val.toUpperCase()).pipe(z.enum(Object.values(MealType) as [string, ...string[]])),
  recipeIds: z.array(z.string()),
});

export type CreateMealDto = z.infer<typeof createMealDto>;
