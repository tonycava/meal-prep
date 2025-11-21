import { IMealRepository } from "../interfaces/IMealRepository";
import { CreateMealDto } from "../dto/createMealDto";
import { Meal } from "../entities/Meal";
import { prisma } from "$lib/db";
import { DeleteMealDto } from "$modules/meal/dto/deleteMealDto.ts";
import { AppError } from "$lib/errors/AppError.ts";
import {
  ListMealsOutput,
  IMealFilters,
  GetMealByIdOutput,
} from "../dto/mealDto";
import { MealType } from "../../../src/generated/prisma";
import { UpdateMealDto } from "$modules/meal/dto/updateMealDto.ts";

export const MealRepository = (): IMealRepository => {
  return {
    async update(mealDto: UpdateMealDto, apiKey: string): Promise<Meal> {
      try {
        // Check if all recipeIds exist and belong to the same apiKey
        if (mealDto.recipeIds) {
          const existingRecipes = await prisma.recipe.findMany({
            where: { id: { in: mealDto.recipeIds }, apiKey: { key: apiKey } },
            select: { id: true },
          });
          if (existingRecipes.length !== mealDto.recipeIds.length) {
            throw new AppError(
              "Bad Request",
              "One or more recipe IDs do not exist or do not belong to your account",
              "Un ou plusieurs identifiants de recette n'existent pas ou n'appartiennent pas à votre compte.",
              "error"
            );
          }
        }

        const updatedMeal = await prisma.meal.update({
          where: { id: mealDto.id, apiKey: { key: apiKey } },
          data: {
            ...(mealDto.mealType && { mealType: mealDto.mealType as MealType }),
            ...(mealDto.recipeIds && {
              recipeMeals: {
                deleteMany: {},
                create: mealDto.recipeIds.map((recipeId) => ({
                  recipeId,
                  type: "Plat", // Default type
                })),
              },
            }),
          },
          include: {
            recipeMeals: true,
          },
        });

        return {
          id: updatedMeal.id,
          mealType: updatedMeal.mealType,
          recipeMeals: updatedMeal.recipeMeals,
        };
      } catch (error) {
        console.log("Error updating meal:", error);
        if (error instanceof AppError) throw error;
        throw new AppError(
          "Internal Server Error",
          "An error occurred while updating meal",
          "Une erreur est survenue lors de la mise à jour du repas.",
          "error"
        );
      }
    },
    async delete(mealDto: DeleteMealDto): Promise<void> {
      try {
        await prisma.meal.delete({
          where: { id: mealDto.id },
        });
      } catch (error) {
        throw new AppError(
          "Internal Server Error",
          "An error occurred while deleting meal",
          "Une erreur est survenue lors de la suppression du repas.",
          "error"
        );
      }
    },
    async save(mealDto: CreateMealDto, apiKey: string): Promise<Meal> {
      try {
        // Check if all recipeIds exist and belong to the same apiKey
        const existingRecipes = await prisma.recipe.findMany({
          where: { id: { in: mealDto.recipeIds }, apiKey: { key: apiKey } },
          select: { id: true },
        });
        if (existingRecipes.length !== mealDto.recipeIds.length) {
          throw new AppError(
            "Bad Request",
            "One or more recipe IDs do not exist or do not belong to your account",
            "Un ou plusieurs identifiants de recette n'existent pas ou n'appartiennent pas à votre compte.",
            "error"
          );
        }

        const createdMeal = await prisma.meal.create({
          data: {
            mealType: mealDto.mealType as MealType,
            apiKey: { connect: { key: apiKey } },
            recipeMeals: {
              create: mealDto.recipeIds.map((recipeId) => ({
                recipeId,
                type: "Plat", // Default type
              })),
            },
          },
          include: {
            recipeMeals: true,
          },
        });

        return {
          id: createdMeal.id,
          mealType: createdMeal.mealType,
          recipeMeals: createdMeal.recipeMeals,
        };
      } catch (error) {
        console.log("Error saving meal:", error);
        if (error instanceof AppError) throw error;
        throw new AppError(
          "Internal Server Error",
          "An error occurred while saving meal",
          "Une erreur est survenue lors de la sauvegarde du repas.",
          "error"
        );
      }
    },
    async list(
      limit: number,
      offset: number,
      filters: IMealFilters,
      apiKey: string
    ): Promise<ListMealsOutput> {
      const apiKeyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
      });

      const where = {
        ...(apiKeyRecord && { apiKeyId: apiKeyRecord.id }),
        ...(filters.mealType && { mealType: filters.mealType as MealType }),
      };

      const [meals, total] = await Promise.all([
        prisma.meal.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { id: "desc" },
          include: {
            recipeMeals: {
              include: {
                recipe: true,
              },
            },
          },
        }),
        prisma.meal.count({ where }),
      ]);

      const data = meals.map((meal) => ({
        id: meal.id,
        mealType: meal.mealType,

        recipeMeals: meal.recipeMeals.map((rm) => ({
          recipeId: rm.recipeId,
          type: rm.type,
        })),
      }));

      return {
        meals: data,
        meta: {
          total,
          offset,
          limit,
        },
      };
    },

    async findById(id: string, apiKey: string): Promise<GetMealByIdOutput> {
      const apiKeyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
      });

      const meal = await prisma.meal.findFirst({
        where: {
          id,
          ...(apiKeyRecord && { apiKeyId: apiKeyRecord.id }),
        },
        include: {
          recipeMeals: {
            include: {
              recipe: true,
            },
          },
        },
      });

      if (!meal) {
        throw new AppError(
          "Not Found",
          "Meal not found",
          "Repas non trouvé.",
          "warn"
        );
      }

      const mealDetailDto = {
        id: meal.id,
        mealType: meal.mealType,
        recipeMeals: meal.recipeMeals.map((rm) => ({
          recipeId: rm.recipeId,
          type: rm.type,
        })),
      };

      return {
        meal: mealDetailDto,
      };
    },
  };
};
