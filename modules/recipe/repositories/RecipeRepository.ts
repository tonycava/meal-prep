import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { prisma } from "$lib/db";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";
import { AppError } from "$lib/errors/AppError.ts";
import {
  ListRecipesOutput,
  IRecipeFilters,
  GetRecipeByIdOutput,
} from "../dto/recipeDto";
import {
  RecipeCategory,
  DietType,
  Prisma,
} from "../../../src/generated/prisma";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";
import { User } from "$lib/common/User.ts";

export const RecipeRepository = (user: User): IRecipeRepository => {
  return {
    async isUseInOneMenu(recipeId: string): Promise<boolean> {
      const menu = await prisma.recipeMeal.findFirst({ where: { recipeId } });
      return !!menu;
    },
    async update(recipeDto: UpdateRecipeDto): Promise<void> {
      try {
        const whereAppend: Prisma.RecipeWhereUniqueInput | object =
          user.role === "user" ? { apiKey: user.apiKey } : {};

        await prisma.recipe.update({
          data: {
            title: recipeDto.title,
          },
          where: { id: recipeDto.id, ...whereAppend },
        });
      } catch (error) {
        console.error("An error occurred while updating recipe", error);
        throw new AppError(
          "Internal Server Error",
          "An error occurred while updating recipe",
          "Une erreur est survenue lors de la mise à jour d'une recette.",
          "error",
        );
      }
    },
    async delete(recipeDto: DeleteRecipeDto): Promise<void> {
      try {
        const whereAppend: Prisma.RecipeWhereUniqueInput | object =
          user.role === "user" ? { apiKey: user.apiKey } : {};

        await prisma.recipe.delete({
          where: { id: recipeDto.id, ...whereAppend },
        });
      } catch (error) {
        console.error("An error occurred while deleting recipe", error);
        throw new AppError(
          "Internal Server Error",
          "An error occurred while deleting recipe",
          "Une erreur est survenue lors de la suppression d'une recette.",
          "error",
        );
      }
    },
    async save(recipeDto: CreateRecipeDto): Promise<Recipe> {
      try {
        const createdRecipe = await prisma.recipe.create({
          data: {
            title: recipeDto.title,
            description: recipeDto.description,
            isPublic: recipeDto.isPublic,
            prepTimeMin: recipeDto.prepTimeMin,
            cookTimeMin: recipeDto.cookTimeMin,
            instructions: recipeDto.instructions,
            apiKey: { connect: { key: user.apiKey } },
          },
        });

        for (const ingredient of recipeDto.ingredients) {
          await prisma.recipeIngredient.create({
            data: {
              quantity: ingredient.quantity,
              ingredient: { connect: { id: ingredient.id } },
              recipe: { connect: { id: createdRecipe.id } },
            },
          });
        }

        return {
          cookTimeMin: createdRecipe.cookTimeMin,
          createdAt: createdRecipe.createdAt,
          description: createdRecipe.description,
          imageUrl: createdRecipe.imageUrl,
          isPublic: createdRecipe.isPublic,
          prepTimeMin: createdRecipe.prepTimeMin,
          servings: createdRecipe.servings,
          title: createdRecipe.title,
          updatedAt: createdRecipe.updatedAt,
          id: createdRecipe.id,
        };
      } catch (error) {
        console.log("Error saving recipe:", error);
        throw new AppError(
          "Internal Server Error",
          "An error occurred while saving recipe",
          "Une erreur est survenue lors de la sauvegarde d'une recette.",
          "error",
        );
      }
    },
    async list(
      limit: number,
      offset: number,
      filters: IRecipeFilters,
    ): Promise<ListRecipesOutput> {
      const where = {
        ...(user.role === "user" ? { apiKey: user.apiKey } : ({} as object)),
        ...(filters.category && {
          category: filters.category as RecipeCategory,
        }),
        ...(filters.diet && { diet: filters.diet as DietType }),
        ...(filters.ingredients && {
          ingredients: {
            some: {
              ingredientId: {
                in: filters.ingredients,
              },
            },
          },
        }),
        ...(filters.search && {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      };

      const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            _count: {
              select: { recipeMeals: true },
            },
          },
        }),
        prisma.recipe.count({ where }),
      ]);

      const data = recipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || "",
        imageUrl: recipe.imageUrl,
        prepTimeMin: recipe.prepTimeMin || 0,
        cookTimeMin: recipe.cookTimeMin || 0,
        servings: recipe.servings,
        isPublic: recipe.isPublic,
        category: recipe.category || "OTHER",
        diet: recipe.diet || "OTHER",
        ingredients: recipe.ingredients.map((recipeIngredient) => ({
          id: recipeIngredient.ingredient.id,
          name: recipeIngredient.ingredient.name,
          quantity: recipeIngredient.quantity,
          unit: recipeIngredient.unit,
        })),
        mealCount: recipe._count.recipeMeals,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      }));

      return {
        recipes: data,
        meta: {
          total,
          offset,
          limit,
        },
      };
    },

    async findById(id: string): Promise<GetRecipeByIdOutput> {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          _count: {
            select: { recipeMeals: true },
          },
        },
      });

      if (!recipe) {
        throw new AppError(
          "Not Found",
          "Recipe not found",
          "Recette non trouvée.",
          "warn",
        );
      }

      const recipeDetailDto = {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || "",
        imageUrl: recipe.imageUrl,
        prepTimeMin: recipe.prepTimeMin || 0,
        cookTimeMin: recipe.cookTimeMin || 0,
        servings: recipe.servings,
        isPublic: recipe.isPublic,
        category: recipe.category || "OTHER",
        diet: recipe.diet || "OTHER",
        ingredients: recipe.ingredients.map((recipeIngredient) => ({
          id: recipeIngredient.ingredient.id,
          name: recipeIngredient.ingredient.name,
          quantity: recipeIngredient.quantity,
          unit: recipeIngredient.unit,
          notes: recipeIngredient.notes || "",
          category: recipeIngredient.ingredient.category || "",
          calories: recipeIngredient.ingredient.calories || 0,
          proteins: recipeIngredient.ingredient.proteins || 0,
          fats: recipeIngredient.ingredient.fats || 0,
          carbs: recipeIngredient.ingredient.carbs || 0,
        })),
        mealCount: recipe._count.recipeMeals,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
        instructions: recipe.instructions,
      };

      return {
        recipe: recipeDetailDto,
      };
    },
  };
};
