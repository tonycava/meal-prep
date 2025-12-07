import { z } from "zod";
import { DietType } from "../../../src/generated/prisma";

const dietTypeValues = Object.values(DietType) as [string, ...string[]];
const dietTypeSchema = z.enum(dietTypeValues);

export const GenerateMenuInputSchema = z.object({
  duration: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 7)).pipe(z.number().min(1, { message: "La durée doit être au minimum de 1 jour" })),
  diet: dietTypeSchema.optional(),
  caloriesMin: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  caloriesMax: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  proteinsMin: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  proteinsMax: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  fatsMin: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  fatsMax: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  carbsMin: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  carbsMax: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  sugarsMin: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  sugarsMax: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  fiberMin: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  fiberMax: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  saltMin: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  saltMax: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
});

export const GenerateMenuOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  duration: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.coerce.date(),
  menuMeals: z.array(
    z.object({
      mealId: z.uuid(),
      dayNumber: z.number(),
    })
  ),
});

export const GenerateMenuResponseSchema = z.object({
  status: z.literal(200),
  data: GenerateMenuOutputSchema,
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

export type GenerateMenuInput = z.infer<typeof GenerateMenuInputSchema>;
export type GenerateMenuOutput = z.infer<typeof GenerateMenuOutputSchema>;
export type GenerateMenuResponse = z.infer<typeof GenerateMenuResponseSchema>;

export interface IMenuGenerationFilters {
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
