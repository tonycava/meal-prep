import { CreateIngredientDto } from "./ingredient.dto";
import { IngredientCategory, MineralType, VitaminType } from "src/generated/prisma";
import { z } from "zod";

const ingredientCategoryValues = Object.values(IngredientCategory) as [string, ...string[]];
const ingredientCategorySchema = z.enum(ingredientCategoryValues);

const ingredientMineralValues = Object.values(MineralType) as [string, ...string[]];
const ingredientMineralSchema = z.enum(ingredientMineralValues);

const ingredientVitaminValues = Object.values(VitaminType) as [string, ...string[]];
const ingredientVitaminSchema = z.enum(ingredientVitaminValues);

export const putIngredientDto = CreateIngredientDto.partial().extend({
	id: z.uuid("Identifier must be a valid UUID"),
});

export const UpdateIngredientDto = z.object({
	name: z.string().min(1),
	category: ingredientCategorySchema,
	proteins: z.number().min(0),
	fats: z.number().min(0),
	carbs: z.number().min(0),
	sugars: z.number().min(0),
	fiber: z.number().min(0),
	salt: z.number().min(0),
	calories: z.number().min(0),
	minerals: z
		.array(
			z.object({
				mineralType: ingredientMineralSchema,
				value: z.number().min(0),
			}),
		)
		.optional(),
	vitamins: z
		.array(
			z.object({
				vitaminType: ingredientVitaminSchema,
				value: z.number().min(0),
			}),
		)
		.optional(),
});

export type PutIngredientDto = z.infer<typeof putIngredientDto>;