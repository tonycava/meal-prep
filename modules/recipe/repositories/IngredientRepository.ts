import { IIngredientRepository } from "../interfaces/IIngredientRepository";
import { Ingredient, IngredientWithQuantityAndUnit } from "../../ingredient/entities/Ingredient";
import { prisma } from "$lib/db";

export const IngredientRepository = (): IIngredientRepository => {
  return {
    async getAllOfRecipe(recipeId: string): Promise<IngredientWithQuantityAndUnit[]> {
      const recipe = await prisma.recipe.findFirst({
        where: { id: recipeId },
        include: { ingredients: { include: { ingredient: true } } }
      });

      if (!recipe) {
        return [];
      }

      const mappedIngredients: IngredientWithQuantityAndUnit[] = recipe.ingredients.map(ingredientDb => {
        const ingredient = ingredientDb.ingredient;

        return {
          id: ingredient.id,
          name: ingredient.name,
          category: ingredient.category ?? undefined,
          proteins: ingredient.proteins,
          fats: ingredient.fats,
          carbs: ingredient.carbs,
          sugars: ingredient.sugars,
          fiber: ingredient.fiber,
          salt: ingredient.salt,
          quantity: ingredientDb.quantity,
          unit: ingredientDb.unit,
          calories: ingredient.calories,
          createdAt: ingredient.createdAt,
          updatedAt: ingredient.updatedAt,
        }
      });


      return mappedIngredients;
    }

  }
}