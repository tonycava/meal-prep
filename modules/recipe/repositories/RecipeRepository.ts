import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { prisma } from "$lib/db";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";
import { AppError } from "$lib/errors/AppError.ts";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";

export const RecipeRepository = (): IRecipeRepository => {
  return {
    async update(recipeDto: UpdateRecipeDto): Promise<void> {
      try {
        await prisma.recipe.update({
          data: {
            title: recipeDto.title,
          },
          where: { id_recipe: recipeDto.id }
        })
      } catch (error) {
        throw new AppError(
          "Internal Server Error",
          "An error occurred while updating recipe",
          "Une erreur est survenue lors de la mise à jour d'une recette.",
          "error"
        )
      }
    },
    async delete(recipeDto: DeleteRecipeDto): Promise<void> {
      try {
        await prisma.recipe.delete({
          where: { id_recipe: recipeDto.id },
        })
      } catch (error) {
        throw new AppError(
          "Internal Server Error",
          "An error occurred while deleting recipe",
          "Une erreur est survenue lors de la suppression d'une recette.",
          "error"
        )
      }
    },
    async save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe> {
      try {
        const createdRecipe = await prisma.recipe.create({
          data: {
            title: recipeDto.title,
            description: recipeDto.description,
            is_public: false,
            prepTimeMin: recipeDto.prepTimeMin,
            cookTimeMin: recipeDto.cookTimeMin,
            image: recipeDto.image,
            apiKey: { connect: { key: apiKey } },
            ingredients: "",
          }
        });

        for (const ingredient of recipeDto.ingredients) {
          await prisma.recipeIngredient.create({
            data: {
              quantity: ingredient.quantity,
              ingredient: { connect: { id_ingredient: ingredient.id } },
              recipe: { connect: { id_recipe: createdRecipe.id_recipe } }
            }
          })
        }

        return { id: createdRecipe.id_recipe }
      } catch (error) {
        throw new AppError(
          "Internal Server Error",
          "An error occurred while saving recipe",
          "Une erreur est survenue lors de la sauvegarde d'une recette.",
          "error"
        )
      }

    }
  }
}