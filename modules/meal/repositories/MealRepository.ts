import { IMealRepository } from "../interfaces/IMealRepository";
import { CreateMealDto } from "../dto/createMealDto";
import { Meal } from "../entities/Meal";
import { prisma } from "$lib/db";
import { DeleteMealDto } from "$modules/meal/dto/deleteMealDto";
import { AppError } from "$lib/errors/AppError";
import {
  ListMealsOutput,
  IMealFilters,
  GetMealByIdOutput,
} from "../dto/mealDto";
import { MealType, DietType } from "$generated/client";
import { UpdateMealDto } from "$modules/meal/dto/updateMealDto";
import { User } from "$lib/common/User";
import {
  GenerateMealOutput,
  IMealGenerationFilters,
} from "../dto/generateMealDto";

export const MealRepository = (user: User): IMealRepository => {
  return {
    async update(mealDto: UpdateMealDto): Promise<Meal> {
      try {
        const existingMeal = await prisma.meal.findFirst({
          where: {
            id: mealDto.id,
            apiKeyId: user.apiKeyId,
          },
        });

        if (!existingMeal) {
          throw new AppError(
            "Not Found",
            "Meal not found or you don't have permission to update it",
            "Repas non trouvé ou vous n'avez pas la permission de le modifier.",
            "warn",
          );
        }

        if (mealDto.recipeIds) {
          const recipeIds = mealDto.recipeIds.map((rm) => rm.recipeId);
          const existingRecipes = await prisma.recipe.findMany({
            where: {
              id: { in: recipeIds },
            },
            select: { id: true },
          });

          if (existingRecipes.length !== recipeIds.length) {
            const existingIds = existingRecipes.map((r) => r.id);
            const missingIds = recipeIds.filter((id) => !existingIds.includes(id));
            throw new AppError(
              "Bad Request",
              `Recipes not found: ${missingIds.join(", ")}`,
              `Recettes non trouvées : ${missingIds.join(", ")}`,
              "warn",
            );
          }
        }

        const updatedMeal = await prisma.meal.update({
          data: {
            ...(mealDto.mealType && { mealType: mealDto.mealType as MealType }),
            ...(mealDto.recipeIds && {
              recipeMeals: {
                deleteMany: {},
                create: mealDto.recipeIds.map((rm) => ({
                  recipeId: rm.recipeId,
                  type: rm.type,
                })),
              },
            }),
          },
          where: {
            id: mealDto.id,
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
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
          "Internal Server Error",
          "An error occurred while updating meal",
          "Une erreur est survenue lors de la mise à jour du repas.",
          "error",
        );
      }
    },
    async delete(mealDto: DeleteMealDto): Promise<void> {
      try {
        const existingMeal = await prisma.meal.findFirst({
          where: {
            id: mealDto.id,
            apiKeyId: user.apiKeyId,
          },
        });

        if (!existingMeal) {
          throw new AppError(
            "Not Found",
            "Meal not found or you don't have permission to delete it",
            "Repas non trouvé ou vous n'avez pas la permission de le supprimer.",
            "warn",
          );
        }

        await prisma.meal.delete({
          where: {
            id: mealDto.id,
          },
        });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
          "Internal Server Error",
          "An error occurred while deleting meal",
          "Une erreur est survenue lors de la suppression du repas.",
          "error",
        );
      }
    },
    async save(mealDto: CreateMealDto): Promise<Meal> {
      try {
        const recipeIds = mealDto.recipeIds.map((rm) => rm.recipeId);
        const existingRecipes = await prisma.recipe.findMany({
          where: {
            id: { in: recipeIds },
          },
          select: { id: true },
        });

        if (existingRecipes.length !== recipeIds.length) {
          const existingIds = existingRecipes.map((r) => r.id);
          const missingIds = recipeIds.filter((id) => !existingIds.includes(id));
          throw new AppError(
            "Bad Request",
            `Recipes not found: ${missingIds.join(", ")}`,
            `Recettes non trouvées : ${missingIds.join(", ")}`,
            "warn",
          );
        }

        const createdMeal = await prisma.meal.create({
          data: {
            mealType: mealDto.mealType as MealType,
            apiKeyId: user.apiKeyId,
            recipeMeals: {
              create: mealDto.recipeIds.map((rm) => ({
                recipeId: rm.recipeId,
                type: rm.type,
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
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
          "Internal Server Error",
          "An error occurred while saving meal",
          "Une erreur est survenue lors de la sauvegarde du repas.",
          "error",
        );
      }
    },
    async list(
      limit: number,
      offset: number,
      role: string,
      filters: IMealFilters,
    ): Promise<ListMealsOutput> {

      const where = role.toLowerCase() === "user" ? { apiKey: { key: user.apiKey } } : {};

      if (filters.mealType) {
        Object.assign(where, { mealType: filters.mealType as MealType });
      }

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recipeMeals: meal.recipeMeals.map((rm) => ({
          recipeId: rm.recipeId,
          type: rm.type as any,
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

    async findById(id: string): Promise<GetMealByIdOutput> {
      const meal = await prisma.meal.findFirst({
        where: {
          id,
          apiKeyId: user.apiKeyId,
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
          "warn",
        );
      }

      const mealDetailDto = {
        id: meal.id,
        mealType: meal.mealType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recipeMeals: meal.recipeMeals.map((rm) => ({
          recipeId: rm.recipeId,
          type: rm.type as any,
        })),
      };

      return {
        meal: mealDetailDto,
      };
    },

    async generate(
      mealType: string | undefined,
      filters: IMealGenerationFilters,
    ): Promise<GenerateMealOutput> {
      const recipes = await prisma.recipe.findMany({
        where: {
          ...(filters.diet && { diet: filters.diet as DietType }),
          isPublic: true,
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      if (!recipes || recipes.length === 0) {
        throw new AppError(
          "Not Found",
          "No recipes found with the specified criteria",
          "Aucune recette trouvée avec les critères spécifiés.",
          "error",
        );
      }

      const filteredRecipes = recipes.filter((recipe) => {
        const nutrition = recipe.ingredients.reduce(
          (acc, ri) => {
            const ing = ri.ingredient;
            const quantity = ri.quantity || 100;
            const factor = quantity / 100;

            return {
              calories: acc.calories + ing.calories * factor,
              proteins: acc.proteins + ing.proteins * factor,
              fats: acc.fats + ing.fats * factor,
              carbs: acc.carbs + ing.carbs * factor,
              sugars: acc.sugars + ing.sugars * factor,
              fiber: acc.fiber + ing.fiber * factor,
              salt: acc.salt + ing.salt * factor,
            };
          },
          {
            calories: 0,
            proteins: 0,
            fats: 0,
            carbs: 0,
            sugars: 0,
            fiber: 0,
            salt: 0,
          },
        );

        if (filters.caloriesMin && nutrition.calories < filters.caloriesMin)
          return false;
        if (filters.caloriesMax && nutrition.calories > filters.caloriesMax)
          return false;
        if (filters.proteinsMin && nutrition.proteins < filters.proteinsMin)
          return false;
        if (filters.proteinsMax && nutrition.proteins > filters.proteinsMax)
          return false;
        if (filters.fatsMin && nutrition.fats < filters.fatsMin) return false;
        if (filters.fatsMax && nutrition.fats > filters.fatsMax) return false;
        if (filters.carbsMin && nutrition.carbs < filters.carbsMin)
          return false;
        if (filters.carbsMax && nutrition.carbs > filters.carbsMax)
          return false;
        if (filters.sugarsMin && nutrition.sugars < filters.sugarsMin)
          return false;
        if (filters.sugarsMax && nutrition.sugars > filters.sugarsMax)
          return false;
        if (filters.fiberMin && nutrition.fiber < filters.fiberMin)
          return false;
        if (filters.fiberMax && nutrition.fiber > filters.fiberMax)
          return false;
        if (filters.saltMin && nutrition.salt < filters.saltMin) return false;
        if (filters.saltMax && nutrition.salt > filters.saltMax) return false;

        return true;
      });

      if (filteredRecipes.length === 0) {
        throw new AppError(
          "Not Found",
          "No recipes match the nutritional criteria",
          "Aucune recette ne correspond aux critères nutritionnels spécifiés.",
          "error",
        );
      }

      const randomRecipe =
        filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
      const selectedMealType = mealType
        ? (mealType as MealType)
        : MealType.LUNCH;

      return {
        id: crypto.randomUUID(),
        mealType: selectedMealType,
        recipeMeals: [
          {
            recipeId: randomRecipe.id,
            type: "MAIN_COURSE",
          },
        ],
      };
    },
  };
};
