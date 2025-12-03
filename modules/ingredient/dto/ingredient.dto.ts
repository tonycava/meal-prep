import { IngredientCategory } from "src/generated/prisma";
import { z } from "zod";

export const MineralTypeEnum = z.enum([
	"CALCIUM",
	"IRON",
	"MAGNESIUM",
	"POTASSIUM",
	"SODIUM",
	"ZINC",
	"PHOSPHORUS",
	"OTHER",
]);

export const VitaminTypeEnum = z.enum([
	"VITAMIN_A",
	"VITAMIN_B1",
	"VITAMIN_B2",
	"VITAMIN_B3",
	"VITAMIN_B6",
	"VITAMIN_B12",
	"VITAMIN_C",
	"VITAMIN_D",
	"VITAMIN_E",
	"VITAMIN_K",
	"OTHER",
]);

const ingredientCategoryValues = Object.values(IngredientCategory) as [
  string,
  ...string[],
];

const ingredientCategorySchema = z.enum(ingredientCategoryValues);

export interface IIngredientFilters {
	category?: (typeof ingredientCategoryValues)[number];
	search?: string;
}

export const IngredientDTOSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	category: ingredientCategorySchema,
	proteins: z.number(),
	fats: z.number(),
	carbs: z.number(),
	sugars: z.number(),
	fiber: z.number(),
	salt: z.number(),
	calories: z.number(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

export const IngredientResponseDto = z.object({
	id: z.uuid(),
	name: z.string(),
	category: ingredientCategorySchema,
	proteins: z.number(),
	fats: z.number(),
	carbs: z.number(),
	sugars: z.number(),
	fiber: z.number(),
	salt: z.number(),
	calories: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	minerals: z
		.array(
			z.object({
				id: z.uuid(),
				mineralType: MineralTypeEnum,
				value: z.number(),
			}),
		)
		.optional(),
	vitamins: z
		.array(
			z.object({
				id: z.uuid(),
				vitaminType: VitaminTypeEnum,
				value: z.number(),
			}),
		)
		.optional(),
});

export const IngredientListQueryDto = z.object({
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 10)),
	offset: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 0)),
	category: ingredientCategorySchema.optional(),
	search: z.string().min(1).optional(),
});

export const CreateIngredientDto = z.object({
	name: z
		.string()
		.optional()
		.refine(
			(val) => val !== undefined && val.length > 0,
			"Name is required",
		),
	category: ingredientCategorySchema.optional(),
	proteins: z.number().min(0).default(0),
	fats: z.number().min(0).default(0),
	carbs: z.number().min(0).default(0),
	sugars: z.number().min(0).default(0),
	fiber: z.number().min(0).default(0),
	salt: z.number().min(0).default(0),
	calories: z.number().min(0).default(0),
	minerals: z
		.array(
			z.object({
				mineralType: MineralTypeEnum,
				value: z.number().min(0),
			}),
		)
		.optional(),
	vitamins: z
		.array(
			z.object({
				vitaminType: VitaminTypeEnum,
				value: z.number().min(0),
			}),
		)
		.optional(),
});

export const UpdateIngredientDto = z.object({
	name: z.string().min(1).optional(),
	category: ingredientCategorySchema.optional(),
	proteins: z.number().min(0).optional(),
	fats: z.number().min(0).optional(),
	carbs: z.number().min(0).optional(),
	sugars: z.number().min(0).optional(),
	fiber: z.number().min(0).optional(),
	salt: z.number().min(0).optional(),
	calories: z.number().min(0).optional(),
	minerals: z
		.array(
			z.object({
				mineralType: MineralTypeEnum,
				value: z.number().min(0),
			}),
		)
		.optional(),
	vitamins: z
		.array(
			z.object({
				vitaminType: VitaminTypeEnum,
				value: z.number().min(0),
			}),
		)
		.optional(),
});

export const ListIngredientsOutputSchema = z.object({
	ingredients: z.array(IngredientDTOSchema),
	meta: z.object({
		total: z.number(),
		limit: z.number(),
		offset: z.number(),
	}),
})

export const GetIngredientByIdDto = z.object({
	id: z.string().uuid("ID invalide"),
});

export type ListIngredientsOutput = z.infer<typeof ListIngredientsOutputSchema>;
export type CreateIngredientDtoType = z.infer<typeof CreateIngredientDto>;
export type UpdateIngredientDtoType = z.infer<typeof UpdateIngredientDto>;
export type GetIngredientByIdDtoType = z.infer<typeof GetIngredientByIdDto>;
export type IngredientResponseDtoType = z.infer<typeof IngredientResponseDto>;
// export type IngredientCategory = z.infer<typeof IngredientCategoryEnum>;
export type MineralType = z.infer<typeof MineralTypeEnum>;
export type VitaminType = z.infer<typeof VitaminTypeEnum>;
