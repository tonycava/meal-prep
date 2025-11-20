import { z } from 'zod';

export const ListMenusInputSchema = z.object({
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  offset: z.string().optional().transform((val) => val ? parseInt(val, 10) : 0),
});

export const MenuDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  duration: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.coerce.date(),
  menuMeals: z.array(z.object({
    mealId: z.string(),
    dayNumber: z.number(),
  })),
});

export const ListMenusOutputSchema = z.object({
  menus: z.array(MenuDTOSchema),
  meta: z.object({
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
  }),
});

export const MealSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  mealType: z.string(),
  order: z.number(),
  dayNumber: z.number(),
  recipe: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    imageUrl: z.string().nullable(),
  }),
});

export const MenuWithMealsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.coerce.date(),
  mealCount: z.number(),
  meals: z.array(MealSchema),
});

export type ListMenusInput = z.infer<typeof ListMenusInputSchema>;
export type MenuDTO = z.infer<typeof MenuDTOSchema>;
export type ListMenusOutput = z.infer<typeof ListMenusOutputSchema>;
export type MenuWithMealsDTO = z.infer<typeof MenuWithMealsSchema>;