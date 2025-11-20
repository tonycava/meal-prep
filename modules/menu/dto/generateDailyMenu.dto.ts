import { z } from "zod";

export const generateDailyMenuDto = z.object({
  numberOfMeals: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int("Le nombre de repas doit être un entier.")
        .min(1, "Le nombre de repas doit être au moins 1.")
        .max(6, "Le nombre de repas ne peut pas dépasser 6."),
    ),
  servings: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int("Le nombre de portions doit être un entier.")
        .min(1, "Le nombre de portions doit être au moins 1."),
    ),
  maxBudget: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(0, "Le budget doit être positif.").optional()),
  diet: z
    .enum([
      "VEGETARIAN",
      "VEGAN",
      "GLUTEN_FREE",
      "DAIRY_FREE",
      "KETO",
      "PALEO",
      "LOW_CARB",
      "OTHER",
    ])
    .optional(),
});

export type GenerateDailyMenuDto = z.infer<typeof generateDailyMenuDto>;
