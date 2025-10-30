import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { prisma } from "$lib/db";

export const RecipeRepository = (): IRecipeRepository => {
  return {
    async save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe> {
      const createdRecipe = await prisma.recipe.create({
        data: {
          title: recipeDto.title,
          description: recipeDto.description,
          is_public: false,
          prepTimeMin: recipeDto.prepTimeMin,
          cookTimeMin: recipeDto.cookTimeMin,
          image: recipeDto.image,
          category: recipeDto.category,
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
    }
  }
}