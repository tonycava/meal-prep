import { z } from "zod";
import { DietEnum, RecipeCategoryEnum } from "../../../src/generated/prisma/enums.ts";

const ingredient = z.object({
  id: z.string(),
  quantity: z.number(),
})

const recipeCategorySchema = z.enum(RecipeCategoryEnum);
const recipeDietSchema = z.object(DietEnum)

export const createRecipeDto = z.object({
  title: z.string().nonempty("Un titre est requis."),
  description: z.string().nonempty("Une description est requise."),

  category: recipeCategorySchema.optional(),
  diet: recipeDietSchema.optional(),
  ingredients: z.array(ingredient).nonempty("Au moins un ingrédients est requis."),
  image: z.string().nonempty("Une image est requise."),
  prepTimeMin: z.number().optional(),
  cookTimeMin: z.number().optional(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeDto>;