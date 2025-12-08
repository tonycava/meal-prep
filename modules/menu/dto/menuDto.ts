import { z } from "zod";

export const GetMenuByIdInputSchema = z.object({
  id: z.uuid({
    message: "Invalid menu ID format",
  }),
});

export const ListMenusInputSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0)),
});

export const MenuDTOSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  duration: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.coerce.date(),
  menuMeals: z.array(z.object({
    mealId: z.uuid(),
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
  id: z.uuid(),
  recipeId: z.string(),
  mealType: z.string(),
  order: z.number(),
  dayNumber: z.number(),
  recipe: z.object({
    id: z.uuid(),
    title: z.string(),
    description: z.string().nullable(),
    imageUrl: z.string().nullable(),
  }),
});

export const MenuWithMealsSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.coerce.date(),
  mealCount: z.number(),
  meals: z.array(MealSchema),
});

export const GetMenuByIdOutputSchema = z.object({
  menu: MenuDTOSchema,
});

export type GetMenuByIdInput = z.infer<typeof GetMenuByIdInputSchema>;
export type GetMenuByIdOutput = z.infer<typeof GetMenuByIdOutputSchema>;
export type ListMenusInput = z.infer<typeof ListMenusInputSchema>;
export type MenuDTO = z.infer<typeof MenuDTOSchema>;
export type ListMenusOutput = z.infer<typeof ListMenusOutputSchema>;
export type MenuWithMealsDTO = z.infer<typeof MenuWithMealsSchema>;
