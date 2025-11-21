import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { GetNutritionDto } from "../dto/getNutritionDto";
import { INutritionRepositoryCalculateNutrition } from "$modules/recipe/interfaces/INutritionRepository";
import { NutritionalInfo } from "$modules/recipe/entities/Nutrition";
import { IIngredientRepositoryGetAllOfRecipe } from "$modules/recipe/interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "../../../lib/common/api/HttpCode";

type Input = InputFactory<
  { dto: GetNutritionDto },
  {
    nutritionRepository: INutritionRepositoryCalculateNutrition;
    ingredientRepository: IIngredientRepositoryGetAllOfRecipe;
  }
>;
type Output = OutputFactory<NutritionalInfo | null>;

export const GetNutrutionUseCase: UseCase<Input, Output> = (dependencies) => {
  const { nutritionRepository, ingredientRepository } = dependencies;
  return {
    async execute(data) {
      const ingredients = await ingredientRepository.getAllOfRecipe(
        data.dto.id,
      );

      const [nutritionalInfoError, nutritionalInfo] = await tryCatch(
        nutritionRepository.calculateNutrition(ingredients),
      );
      if (nutritionalInfoError)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          nutritionalInfoError.userFriendlyMessage,
        );

      return UseCaseResponseBuilder.success(HttpCode.OK, nutritionalInfo);
    },
  };
};
