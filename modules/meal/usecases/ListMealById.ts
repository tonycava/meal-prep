import {
  UseCase,
  InputFactory,
  UseCaseResponseBuilder,
  OutputFactory,
} from "$lib/common/usecase.ts";
import { IMealRepositoryFindById } from "../interfaces/IMealRepository";
import { GetMealByIdOutput } from "../dto/mealDto";
import { tryCatch } from "$lib/errors/tryCatch.ts";

type Input = InputFactory<
  { id: string; },
  { mealRepository: IMealRepositoryFindById }
>;
type Output = OutputFactory<GetMealByIdOutput>;

export const GetMealByIdUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(
        mealRepository.findById(data.id)
      );

      if (error)
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      if (!result) {
        return UseCaseResponseBuilder.error(404, "Meal not found");
      }
      return UseCaseResponseBuilder.success(200, result);
    },
  };
};
