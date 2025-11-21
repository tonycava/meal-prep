import {
  UseCase,
  InputFactory,
  UseCaseResponseBuilder,
  OutputFactory,
} from "$lib/common/usecase";
import { IMealRepositoryList } from "../interfaces/IMealRepository";
import { IMealFilters, ListMealsOutput } from "../dto/mealDto";
import { tryCatch } from "$lib/errors/tryCatch";

type Input = InputFactory<
  { limit: number; offset: number; filters?: IMealFilters; apiKey: string },
  { mealRepository: IMealRepositoryList }
>;

type Output = OutputFactory<ListMealsOutput>;

export const ListMealsUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(
        mealRepository.list(
          data.limit,
          data.offset,
          data.filters || {},
          data.apiKey,
        ),
      );

      if (error)
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(200, result);
    },
  };
};
