import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { RecipeWithIngredients } from "../entities/Recipe";
import { prisma } from "$lib/db";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto";
import { AppError } from "$lib/errors/AppError";
import { DietType, Prisma, RecipeCategory, UnitType, } from "../../../src/generated/prisma";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto";
import { User } from "$lib/common/User";
import { WithPagination } from "$lib/common/types/WithPagination";
import { IRecipeFilters } from "$modules/recipe/utils/IRecipeFilters";

export const RecipeRepository = (user: User): IRecipeRepository => {
  return {
    async isUseInOneMenu(recipeId: string): Promise<boolean> {
      const menu = await prisma.recipeMeal.findFirst({ where: { recipeId } });
      return !!menu;
    },
    async update(recipeDto: UpdateRecipeDto) {
      try {
        const recipe = await this.findById(recipeDto.id);
        if (!recipe)
          return null;

        const ingredientsToDelete = recipe.recipeIngredients.filter(
          (child) => !recipeDto.ingredients?.some((c) => c.id === child.id),
        );

        for (const ingredientsToDeleteElement of ingredientsToDelete) {
          await prisma.recipeIngredient.delete({
            where: {
              recipeId_ingredientId: {
                recipeId: recipeDto.id,
                ingredientId: ingredientsToDeleteElement.id,
              }
            }
          });
        }

        const ingredientsToAddd =
          recipeDto.ingredients?.filter(
            (newMeal) =>
              !recipe.recipeIngredients.some(
                (existing) => existing.id === newMeal.id,
              ),
          ) || [];

        for (const ingredientsToAdddElement of ingredientsToAddd) {
          await prisma.recipeIngredient.create({
            data: {
              recipeId: recipeDto.id,
              ingredientId: ingredientsToAdddElement.id,
              quantity: ingredientsToAdddElement.quantity,
              unit: ingredientsToAdddElement.unit as UnitType,
            },
          });
        }

        const whereAppend: Prisma.RecipeWhereUniqueInput | object =
          user.role === "user" ? { apiKey: user.apiKey } : {};

        await prisma.recipe.update({
          data: {
            title: recipeDto.title,
            description: recipeDto.description,
            isPublic: recipeDto.isPublic,
            servings: recipeDto.servings,
            category: recipeDto.category as RecipeCategory,
            diet: recipeDto.diet as DietType,
            prepTimeMin: recipeDto.prepTimeMin,
            cookTimeMin: recipeDto.cookTimeMin,
            instructions: recipeDto.instructions,
          },
          where: { id: recipeDto.id, ...whereAppend },
        });

        return this.findById(recipeDto.id);
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

        const recipeExist = await prisma.recipe.findUnique({
          where: { id: recipeDto.id, ...whereAppend },
        });

        if (!recipeExist)
          return;

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
    async save(recipeDto: CreateRecipeDto): Promise<RecipeWithIngredients> {
      try {
        const createdRecipe = await prisma.recipe.create({
          data: {
            title: recipeDto.title,
            description: recipeDto.description,
            isPublic: recipeDto.isPublic,
            servings: recipeDto.servings,
            category: recipeDto.category as RecipeCategory,
            diet: recipeDto.diet as DietType,
            prepTimeMin: recipeDto.prepTimeMin,
            cookTimeMin: recipeDto.cookTimeMin,
            instructions: recipeDto.instructions,
            ingredients: {
              create: recipeDto.ingredients.map((ingredient) => ({
                quantity: ingredient.quantity,
                unit: ingredient.unit as UnitType,
                ingredient: {
                  connect: { id: ingredient.id },
                },
              })),
            },
            apiKey: { connect: { key: user.apiKey } },
          },
          include: { ingredients: true }
        });

        return {
          id: createdRecipe.id,
          cookTimeMin: createdRecipe.cookTimeMin,
          createdAt: createdRecipe.createdAt,
          description: createdRecipe.description,
          imageUrl: createdRecipe.imageUrl,
          isPublic: createdRecipe.isPublic,
          prepTimeMin: createdRecipe.prepTimeMin,
          servings: createdRecipe.servings,
          title: createdRecipe.title,
          updatedAt: createdRecipe.updatedAt,
          instructions: createdRecipe.instructions,
          category: createdRecipe.category,
          diet: createdRecipe.diet,
          recipeIngredients: createdRecipe.ingredients.map(ingredient => ({
            id: ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })),
        };
      } catch (error) {
        console.log("Error saving recipe:", error);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (error.meta.cause.includes("No 'Ingredient' record")) {
          throw new AppError(
            "Internal Server Error",
            "An error occurred while saving recipe",
            "Un des ingrédients n'existe pas dans la base de données.",
            "error",
          );
        }
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
    ): Promise<WithPagination<RecipeWithIngredients[], "recipes">> {
      const where: Prisma.RecipeWhereInput = {
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
        OR: [
          user.role === "user" ? { apiKeyId: user.apiKey } : ({} as object),
          { isPublic: true },
          ...(filters.search
            ? [
              { title: { contains: filters.search, mode: "insensitive" } },
              {
                description: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
            ]
            : []),
        ],
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

      const data: RecipeWithIngredients[] = recipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        instructions: recipe.instructions,
        prepTimeMin: recipe.prepTimeMin,
        cookTimeMin: recipe.cookTimeMin,
        servings: recipe.servings,
        isPublic: recipe.isPublic,
        category: recipe.category,
        diet: recipe.diet,
        recipeIngredients: recipe.ingredients.map((recipeIngredient) => ({
          id: recipeIngredient.ingredient.id,
          quantity: recipeIngredient.quantity,
          unit: recipeIngredient.unit,
        })),
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

    async findById(id: string): Promise<RecipeWithIngredients | null> {
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

      if (!recipe)
        return null;

      return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        prepTimeMin: recipe.prepTimeMin,
        cookTimeMin: recipe.cookTimeMin,
        servings: recipe.servings,
        isPublic: recipe.isPublic,
        category: recipe.category,
        diet: recipe.diet,
        recipeIngredients: recipe.ingredients.map((recipeIngredient) => ({
          id: recipeIngredient.ingredient.id,
          quantity: recipeIngredient.quantity,
          unit: recipeIngredient.unit,
        })),
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
        instructions: recipe.instructions,
      };
    },
  };
};
