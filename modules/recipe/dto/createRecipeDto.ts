import { z } from "zod";
import { DietType, RecipeCategory, UnitType } from "../../../src/generated/prisma";

const recipeUnitalues = Object.values(UnitType) as [string, ...string[]];
const recipeUnitchema = z.enum(recipeUnitalues);

const ingredient = z.object({
  id: z.string(),
  quantity: z.number().min(1, 'La quantité doit être au moins de 1.'),
  unit: recipeUnitchema,
});

const recipeDietValues = Object.values(DietType) as [string, ...string[]];
const recipeDietSchema = z.enum(recipeDietValues);

const recipeCategoriesValues = Object.values(RecipeCategory) as [string, ...string[]];
const recipeCategoriesSchema = z.enum(recipeCategoriesValues);

export const createRecipeDto = z.object({
  title: z.string().nonempty("Un titre est requis."),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  instructions: z.string().nonempty("Des instructions sont requises."),

  diet: recipeDietSchema.optional(),
  category: recipeCategoriesSchema.optional(),

  ingredients: z
    .array(ingredient)
    .nonempty("Au moins un ingrédients est requis."),
  servings: z.number().optional(),

  imageUrl: z.string().optional(),
  prepTimeMin: z.number().optional(),
  cookTimeMin: z.number().optional(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeDto>;
