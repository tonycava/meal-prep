import { NutritionalInfo } from "$modules/recipe/entities/Nutrition.ts";
import { IngredientWithQuantityAndUnit } from "$modules/ingredient/entities/Ingredient.ts";

export interface INutritionRepositoryCalculateNutrition {
  calculateNutrition(ingredients: IngredientWithQuantityAndUnit[]): Promise<NutritionalInfo | null>;
}

export type INutritionRepository =
  INutritionRepositoryCalculateNutrition;