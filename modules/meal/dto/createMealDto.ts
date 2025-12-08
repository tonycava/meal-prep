import { z } from "zod";
import { MealType } from "../../../src/generated/prisma";

const RecipeMeal = z.object({
  recipeId: z.uuid("L'ID de la recette doit être un UUID valide."),
  type: z.string().nonempty("Le type est requis."),
});

export const createMealDto = z.object({
  mealType: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(Object.values(MealType) as [string, ...string[]]),
  ),
  recipeIds: z.array(RecipeMeal).min(1, "Au moins une recette est requise."),
});

export type CreateMealDto = z.infer<typeof createMealDto>;
