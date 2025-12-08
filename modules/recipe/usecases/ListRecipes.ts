import {
  UseCase,
  InputFactory,
  UseCaseResponseBuilder,
  OutputFactory,
} from "$lib/common/usecase";
import { IRecipeRepositoryList } from "../interfaces/IRecipeRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";
import { RecipeWithIngredients } from "$modules/recipe/entities/Recipe";
import { WithPagination } from "$lib/common/types/WithPagination";
import { IRecipeFilters } from "$modules/recipe/utils/IRecipeFilters";

type Input = InputFactory<
  { limit: number; offset: number; filters?: IRecipeFilters; apiKey: string },
  { recipeRepository: IRecipeRepositoryList }
>;

type Output = OutputFactory<WithPagination<RecipeWithIngredients[], "recipes">>;

export const ListRecipesUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(
        recipeRepository.list(data.limit, data.offset, data.filters || {}),
      );

      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );

      return UseCaseResponseBuilder.success(HttpCode.OK, result);
    },
  };
};
