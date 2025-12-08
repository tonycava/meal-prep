import z from "zod";
import { RecipeCategory, DietType } from "../../../generated/client";

const recipeCategoryValues = Object.values(RecipeCategory) as [
  string,
  ...string[],
];
const recipeDietValues = Object.values(DietType) as [string, ...string[]];

const recipeCategorySchema = z.enum(recipeCategoryValues);
const recipeDietSchema = z.enum(recipeDietValues);
export const listRecipesInputDto = z.object({
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .optional(),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0)),
  category: recipeCategorySchema.optional(),
  diet: recipeDietSchema.optional(),
  search: z.string().optional(),
  ingredients: z
    .union([z.string().transform((val) => val.split(",")), z.array(z.string())])
    .optional(),
});