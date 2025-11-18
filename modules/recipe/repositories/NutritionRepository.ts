import { INutritionRepository } from "../interfaces/INutritionRepository";
import { IngredientWithQuantityAndUnit } from "../../ingredient/entities/Ingredient";
import AiService from "../services/ai.service";
import { AppError } from "$lib/errors/AppError.ts";

export const NutritionRepository = (): INutritionRepository => {
  return {
    async calculateNutrition(ingredients: IngredientWithQuantityAndUnit[]) {
      try {
        return await AiService.generateNutritionFacts(ingredients);
      } catch (error) {
        console.error("Error calculating nutrition:", error);
        throw new AppError(
          "Internal Server Error",
          "An error occurred while calculating nutritional information.",
          "Une erreur est survenue lors du calcul des informations nutritionnelles.",
          "error"
        );
      }
    }
  }
}