import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { HttpCode } from "$lib/common/api/HttpCode";
import { tryCatch } from "$lib/errors/tryCatch";
import { IMealRepositoryGenerate } from "../interfaces/IMealRepository";
import {
  GenerateMealOutput,
  IMealGenerationFilters,
} from "../dto/generateMealDto";

type Input = InputFactory<
  {
    mealType?: string;
    filters: IMealGenerationFilters;
  },
  { mealRepository: IMealRepositoryGenerate }
>;

type Output = OutputFactory<GenerateMealOutput>;

export const GenerateMealUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;

  return {
    async execute(data): Promise<Output> {
      const { mealType, filters } = data;

      const [error, result] = await tryCatch(
        mealRepository.generate(mealType, filters),
      );

      if (error) {
        let status = HttpCode.INTERNAL_SERVER_ERROR;

        if (error.name === "Not Found") status = HttpCode.NOT_FOUND;
        if (error.name === "Unauthorized") status = HttpCode.UNAUTHORIZED;

        return UseCaseResponseBuilder.error(status, error.userFriendlyMessage);
      }

      return UseCaseResponseBuilder.success(HttpCode.OK, result);
    },
  };
};
