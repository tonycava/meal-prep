import { RecipeCategory, DietType } from "../../../src/generated/prisma";
import z from "zod";


const recipeCategoryValues = Object.values(RecipeCategory) as [
  string,
  ...string[],
];
const recipeDietValues = Object.values(DietType) as [string, ...string[]];

const recipeCategorySchema = z.enum(recipeCategoryValues);
const recipeDietSchema = z.enum(recipeDietValues);

export interface IRecipeFilters {
  category?: (typeof recipeCategoryValues)[number];
  diet?: (typeof recipeDietValues)[number];
  ingredients?: string[];
  search?: string;
}
