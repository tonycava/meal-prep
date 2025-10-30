import z from "zod";

export const recipeQueryDto = z.object({
      category: z.enum([
            'APPETIZER',
            'MAIN_COURSE',
            'SIDE_DISH',
            'DESSERT',
            'SNACK',
            'BEVERAGE',
            'BREAKFAST',
            'OTHER'
      ]).optional(),
      diet: z.enum([
            'VEGETARIAN',
            'VEGAN',
            'GLUTEN_FREE',
            'DAIRY_FREE',
            'KETO',
            'PALEO',
            'LOW_CARB',
            'OTHER'
      ]).optional(),
      ingredients: z.string().optional(),
      search: z.string().optional(),
      limit: z.coerce.number().int().nonnegative().default(10),
      offset: z.coerce.number().int().nonnegative().default(0),
});

export type RecipeQueryDto = z.infer<typeof recipeQueryDto>;