import {
  UseCase,
  InputFactory,
  UseCaseResponseBuilder,
  OutputFactory,
} from "$lib/common/usecase.ts";
import { IRecipeRepositoryList } from "../interfaces/IRecipeRepository";
import { IRecipeFilters, ListRecipesOutput } from "../dto/recipeDto";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
  { limit: number; offset: number; filters?: IRecipeFilters; apiKey: string },
  { recipeRepository: IRecipeRepositoryList }
>;

type Output = OutputFactory<ListRecipesOutput>;

export const ListRecipesUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(
        recipeRepository.list(
          data.limit,
          data.offset,
          data.filters || {},
        ),
      );

      if (error)
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(HttpCode.OK, result);
    },
  };
};
