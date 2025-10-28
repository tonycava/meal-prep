import z from "zod";

export const recipeDto = z.object({
      category: z.string(),
      diet: z.string(),
      ingredients: z.string(),
      search: z.string(),
});

export type RecipeDto = z.infer<typeof recipeDto>;