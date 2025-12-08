import {
  UseCase,
  InputFactory,
  UseCaseResponseBuilder,
  OutputFactory,
} from "$lib/common/usecase";
import { IRecipeRepositoryFindById } from "../interfaces/IRecipeRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";
import { RecipeWithIngredients } from "$modules/recipe/entities/Recipe";

type Input = InputFactory<
  { id: string; apiKey: string },
  { recipeRepository: IRecipeRepositoryFindById }
>;
type Output = OutputFactory<{ recipe: RecipeWithIngredients }>;

export const GetRecipeByIdUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, recipe] = await tryCatch(
        recipeRepository.findById(data.id),
      );

      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );

      if (!recipe) {
        return UseCaseResponseBuilder.error(
          HttpCode.NOT_FOUND,
          "Recipe not found",
        );
      }
      return UseCaseResponseBuilder.success(HttpCode.OK, { recipe });
    },
  };
};
