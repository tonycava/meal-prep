import { IIngredientRepository } from "../interfaces/IIngredientRepository";
import { CreateIngredientDtoType, UpdateIngredientDtoType, IngredientResponseDtoType } from "../dto/ingredient.dto";
import { prisma } from "../../../lib/db";

export const IngredientRepository = (): IIngredientRepository => {
  return {
    async create(ingredientDto: CreateIngredientDtoType): Promise<IngredientResponseDtoType> {
      const createdIngredient = await prisma.ingredient.create({
        data: {
          name: ingredientDto.name!,
          category: ingredientDto.category!,
          proteins: ingredientDto.proteins!,
          fats: ingredientDto.fats!,
          carbs: ingredientDto.carbs!,
          sugars: ingredientDto.sugars!,
          fiber: ingredientDto.fiber!,
          salt: ingredientDto.salt!,
          calories: ingredientDto.calories!,
          minerals: ingredientDto.minerals ? {
            create: ingredientDto.minerals.map(mineral => ({
              mineralType: mineral.mineralType,
              value: mineral.value
            }))
          } : undefined,
          vitamins: ingredientDto.vitamins ? {
            create: ingredientDto.vitamins.map(vitamin => ({
              vitaminType: vitamin.vitaminType,
              value: vitamin.value
            }))
          } : undefined
        },
        include: {
          minerals: true,
          vitamins: true
        }
      });

      return createdIngredient;
    },

    async update(id: string, ingredientDto: UpdateIngredientDtoType): Promise<IngredientResponseDtoType | null> {
      // Check if ingredient exists
      const existingIngredient = await prisma.ingredient.findUnique({
        where: { id }
      });
      if (!existingIngredient) {
        return null;
      }

      if (ingredientDto.minerals !== undefined) {
        await prisma.ingredientMineral.deleteMany({
          where: { ingredientId: id }
        });
      }

      if (ingredientDto.vitamins !== undefined) {
        await prisma.ingredientVitamin.deleteMany({
          where: { ingredientId: id }
        });
      }

      const updatedIngredient = await prisma.ingredient.update({
        where: { id },
        data: {
          ...(ingredientDto.name !== undefined && { name: ingredientDto.name }),
          ...(ingredientDto.category !== undefined && { category: ingredientDto.category }),
          ...(ingredientDto.proteins !== undefined && { proteins: ingredientDto.proteins }),
          ...(ingredientDto.fats !== undefined && { fats: ingredientDto.fats }),
          ...(ingredientDto.carbs !== undefined && { carbs: ingredientDto.carbs }),
          ...(ingredientDto.sugars !== undefined && { sugars: ingredientDto.sugars }),
          ...(ingredientDto.fiber !== undefined && { fiber: ingredientDto.fiber }),
          ...(ingredientDto.salt !== undefined && { salt: ingredientDto.salt }),
          ...(ingredientDto.calories !== undefined && { calories: ingredientDto.calories }),
          ...(ingredientDto.minerals && {
            minerals: {
              create: ingredientDto.minerals.map(mineral => ({
                mineralType: mineral.mineralType,
                value: mineral.value
              }))
            }
          }),
          ...(ingredientDto.vitamins && {
            vitamins: {
              create: ingredientDto.vitamins.map(vitamin => ({
                vitaminType: vitamin.vitaminType,
                value: vitamin.value
              }))
            }
          })
        },
        include: {
          minerals: true,
          vitamins: true
        }
      });

      return updatedIngredient;
    },

    async delete(id: string): Promise<boolean> {
      // Check if ingredient exists
      const existingIngredient = await prisma.ingredient.findUnique({
        where: { id }
      });
      if (!existingIngredient) {
        return false;
      }

      await prisma.ingredient.delete({
        where: { id }
      });
      return true;
    },

    async getById(id: string): Promise<IngredientResponseDtoType | null> {
      const ingredient = await prisma.ingredient.findUnique({
        where: { id },
        include: {
          minerals: true,
          vitamins: true
        }
      });

      return ingredient;
    },

    async searchByName(name: string): Promise<IngredientResponseDtoType[]> {
      const ingredients = await prisma.ingredient.findMany({
        where: { name: { contains: name } },
        include: {
          minerals: true,
          vitamins: true
        }
      });

      return ingredients;
    }
  };
};