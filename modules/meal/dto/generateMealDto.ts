import { z } from "zod";
import { DietType, MealType } from "$generated/client";

const dietTypeValues = Object.values(DietType) as [string, ...string[]];
const dietTypeSchema = z
  .string()
  .transform((val) => val.toUpperCase())
  .pipe(z.enum(dietTypeValues));

const mealTypeValues = Object.values(MealType) as [string, ...string[]];
const mealTypeSchema = z
  .string()
  .transform((val) => val.toUpperCase())
  .pipe(z.enum(mealTypeValues));

export const GenerateMealInputSchema = z.object({
  mealType: mealTypeSchema.optional(),
  diet: dietTypeSchema.optional(),
  caloriesMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  caloriesMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  proteinsMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  proteinsMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  fatsMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  fatsMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  carbsMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  carbsMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  sugarsMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  sugarsMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  fiberMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  fiberMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  saltMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  saltMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
});

export const GenerateMealOutputSchema = z.object({
  id: z.string(),
  mealType: z.string(),
  recipeMeals: z.array(
    z.object({
      recipeId: z.string(),
      type: z.string(),
    }),
  ),
});

export const GenerateMealResponseSchema = z.object({
  status: z.literal(200),
  data: GenerateMealOutputSchema,
  _links: z.object({
    self: z.object({
      href: z.string(),
      method: z.literal("GET"),
      title: z.string(),
    }),
    save: z.object({
      href: z.string(),
      method: z.literal("POST"),
      title: z.string(),
    }),
  }),
});

export type GenerateMealInput = z.infer<typeof GenerateMealInputSchema>;
export type GenerateMealOutput = z.infer<typeof GenerateMealOutputSchema>;
export type GenerateMealResponse = z.infer<typeof GenerateMealResponseSchema>;

export interface IMealGenerationFilters {
  diet?: string;
  caloriesMin?: number;
  caloriesMax?: number;
  proteinsMin?: number;
  proteinsMax?: number;
  fatsMin?: number;
  fatsMax?: number;
  carbsMin?: number;
  carbsMax?: number;
  sugarsMin?: number;
  sugarsMax?: number;
  fiberMin?: number;
  fiberMax?: number;
  saltMin?: number;
  saltMax?: number;
}
