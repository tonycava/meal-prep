import { z } from "zod";

const menuItemSchema = z.object({
  recipeId: z.uuid("L'ID de la recette doit être un UUID valide."),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"], {
    message: "Le type de repas doit être BREAKFAST, LUNCH, DINNER ou SNACK."
  }),
  dayNumber: z.number().int().min(1, "Le numéro du jour doit être au moins 1.").max(7, "Le numéro du jour ne peut pas dépasser 7."),
  order: z.number().int().min(0, "L'ordre doit être un nombre positif ou zéro.")
});

export const createMenuDto = z.object({
  name: z.string().nonempty("Un nom est requis pour le menu."),
  description: z.string().optional(),
  items: z.array(menuItemSchema).min(1, "Au moins un élément de menu est requis.")
});

export type CreateMenuDto = z.infer<typeof createMenuDto>;
