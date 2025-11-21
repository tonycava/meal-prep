import { NutritionalInfo } from "$modules/recipe/entities/Nutrition";
import { IngredientWithQuantityAndUnit } from "$modules/ingredient/entities/Ingredient";

export interface INutritionRepositoryCalculateNutrition {
  calculateNutrition(
    ingredients: IngredientWithQuantityAndUnit[],
  ): Promise<NutritionalInfo | null>;
}

export type INutritionRepository = INutritionRepositoryCalculateNutrition;
