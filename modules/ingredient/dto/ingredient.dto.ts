import { z } from 'zod';

export const IngredientCategoryEnum = z.enum([
  'VEGETABLE',
  'FRUIT',
  'MEAT',
  'FISH',
  'DAIRY',
  'GRAIN',
  'LEGUME',
  'NUT',
  'SPICE',
  'OIL',
  'OTHER'
]);

export const MineralTypeEnum = z.enum([
  'CALCIUM',
  'IRON',
  'MAGNESIUM',
  'POTASSIUM',
  'SODIUM',
  'ZINC',
  'PHOSPHORUS',
  'OTHER'
]);

export const VitaminTypeEnum = z.enum([
  'VITAMIN_A',
  'VITAMIN_B1',
  'VITAMIN_B2',
  'VITAMIN_B3',
  'VITAMIN_B6',
  'VITAMIN_B12',
  'VITAMIN_C',
  'VITAMIN_D',
  'VITAMIN_E',
  'VITAMIN_K',
  'OTHER'
]);

export const IngredientResponseDto = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: IngredientCategoryEnum.nullable(),
  proteins: z.number(),
  fats: z.number(),
  carbs: z.number(),
  sugars: z.number(),
  fiber: z.number(),
  salt: z.number(),
  calories: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  minerals: z.array(z.object({
    id: z.string().uuid(),
    mineralType: MineralTypeEnum,
    value: z.number()
  })).optional(),
  vitamins: z.array(z.object({
    id: z.string().uuid(),
    vitaminType: VitaminTypeEnum,
    value: z.number()
  })).optional()
});

export const IngredientListQueryDto = z.object({
  category: IngredientCategoryEnum.optional(),
  search: z.string().min(1).optional(),
  limit: z.number().min(1).max(100).default(20).optional(),
  offset: z.number().min(0).default(0).optional(),
});

export const CreateIngredientDto = z.object({
  name: z.string().optional().refine(val => val !== undefined && val.length > 0, "Le champ 'name' est obligatoire et doit être une chaîne non vide"),
  category: IngredientCategoryEnum.optional(),
  proteins: z.number().min(0).default(0),
  fats: z.number().min(0).default(0),
  carbs: z.number().min(0).default(0),
  sugars: z.number().min(0).default(0),
  fiber: z.number().min(0).default(0),
  salt: z.number().min(0).default(0),
  calories: z.number().min(0).default(0),
  minerals: z.array(z.object({
    mineralType: MineralTypeEnum,
    value: z.number().min(0)
  })).optional(),
  vitamins: z.array(z.object({
    vitaminType: VitaminTypeEnum,
    value: z.number().min(0)
  })).optional()
});

export const UpdateIngredientDto = z.object({
  name: z.string().min(1).optional(),
  category: IngredientCategoryEnum.optional(),
  proteins: z.number().min(0).optional(),
  fats: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  sugars: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  salt: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  minerals: z.array(z.object({
    mineralType: MineralTypeEnum,
    value: z.number().min(0)
  })).optional(),
  vitamins: z.array(z.object({
    vitaminType: VitaminTypeEnum,
    value: z.number().min(0)
  })).optional()
});

export const GetIngredientByIdDto = z.object({
  id: z.string().uuid("ID invalide")
});

export type CreateIngredientDtoType = z.infer<typeof CreateIngredientDto>;
export type UpdateIngredientDtoType = z.infer<typeof UpdateIngredientDto>;
export type GetIngredientByIdDtoType = z.infer<typeof GetIngredientByIdDto>;
export type IngredientResponseDtoType = z.infer<typeof IngredientResponseDto>;
export type IngredientCategory = z.infer<typeof IngredientCategoryEnum>;
export type MineralType = z.infer<typeof MineralTypeEnum>;
export type VitaminType = z.infer<typeof VitaminTypeEnum>;
