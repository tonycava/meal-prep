import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { HttpCode } from "$lib/common/api/HttpCode";
import { tryCatch } from "$lib/errors/tryCatch";
import { IMenuRepositoryGenerate } from "../interfaces/IMenuRepository";
import { GenerateMenuOutput, IMenuGenerationFilters } from "../dto/generateMenuDto";

type Input = InputFactory<
  {
    duration: number;
    filters: IMenuGenerationFilters;
  },
  { menuRepository: IMenuRepositoryGenerate }
>;

type Output = OutputFactory<GenerateMenuOutput>;

export const GenerateMenuUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;

  return {
    async execute(data): Promise<Output> {
      const { duration, filters } = data;

      const [error, result] = await tryCatch(
        menuRepository.generate(duration, filters)
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
