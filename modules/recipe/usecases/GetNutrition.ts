import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { INutritionRepositoryCalculateNutrition } from "$modules/recipe/interfaces/INutritionRepository";
import { NutritionalInfo } from "$modules/recipe/entities/Nutrition";
import { IIngredientRepositoryGetAllOfRecipe } from "$modules/recipe/interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";
import { GetByIdDto } from "$lib/common/dto/getByIdDto";
import { IRecipeRepositoryFindById } from "$modules/recipe/interfaces/IRecipeRepository";

type Input = InputFactory<
  { dto: GetByIdDto },
  {
    nutritionRepository: INutritionRepositoryCalculateNutrition;
    ingredientRepository: IIngredientRepositoryGetAllOfRecipe;
    recipeRepository: IRecipeRepositoryFindById;
  }
>;
type Output = OutputFactory<NutritionalInfo | null>;

export const GetNutrutionUseCase: UseCase<Input, Output> = (dependencies) => {
  const { nutritionRepository, ingredientRepository, recipeRepository } = dependencies;
  return {
    async execute(data) {
      const recipe = await recipeRepository.findById(data.dto.id);
      if (!recipe) {
        return UseCaseResponseBuilder.error(
          HttpCode.NOT_FOUND,
          `Recipe not found`,
        );
      }

      const ingredients = await ingredientRepository.getAllOfRecipe(
        data.dto.id,
      );

      const [nutritionalInfoError, nutritionalInfo] = await tryCatch(
        nutritionRepository.calculateNutrition(ingredients),
      );
      console.log(nutritionalInfo)
      if (nutritionalInfoError)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          nutritionalInfoError.userFriendlyMessage,
        );

      return UseCaseResponseBuilder.success(HttpCode.OK, nutritionalInfo);
    },
  };
};
