import { z } from "zod";
import { DietType } from "../../../src/generated/prisma";

const ingredient = z.object({
  id: z.string(),
  quantity: z.number(),
});

const recipeDietValues = Object.values(DietType) as [string, ...string[]];

const recipeDietSchema = z.enum(recipeDietValues);

export const createRecipeDto = z.object({
  title: z.string().nonempty("Un titre est requis."),
  description: z.string().nonempty("Une description est requise."),
  isPublic: z.boolean().optional(),
  instructions: z.string().nonempty("Des instructions sont requises."),

  diet: recipeDietSchema.optional(),
  ingredients: z
    .array(ingredient)
    .nonempty("Au moins un ingrédients est requis."),
  image: z.string().nonempty("Une image est requise."),
  prepTimeMin: z.number().optional(),
  cookTimeMin: z.number().optional(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeDto>;
