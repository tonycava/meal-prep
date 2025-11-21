import { z } from "zod";

const menuMealSchema = z.object({
  mealId: z.uuid("L'ID du repas doit être un UUID valide."),
  dayNumber: z
    .number()
    .int()
    .min(1, "Le numéro du jour doit être au moins 1.")
    .max(7, "Le numéro du jour ne peut pas dépasser 7."),
});

export const createMenuDto = z.object({
  name: z.string().nonempty("Un nom est requis pour le menu."),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  mealIds: z.array(menuMealSchema).min(1, "Au moins un repas est requis."),
});

export const createMenuPartialDtoWithId = createMenuDto.partial().extend({
  id: z.uuid("L'id doit être valide."),
});

export type CreateMenuPartialDtoWithId = z.infer<
  typeof createMenuPartialDtoWithId
>;

export type CreateMenuDto = z.infer<typeof createMenuDto>;
