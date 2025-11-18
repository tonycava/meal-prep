import { z } from "zod";

export const nutritionalInfoSchema = z.object({
  proteins: z.number().nonnegative(),
  fats: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  sugars: z.number().nonnegative(),
  fiber: z.number().nonnegative(),
  salt: z.number().nonnegative(), // grams
  calories: z.number().nonnegative(),
})
  .refine((v) => v.sugars <= v.carbs, {
    message: "sugars must be less than or equal to carbs",
    path: ["sugars"],
  })
  .refine((v) => v.fiber <= v.carbs, {
    message: "fiber must be less than or equal to carbs",
    path: ["fiber"],
  });