import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IMealRepositoryUpdate } from "../interfaces/IMealRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { UpdateMealDto } from "$modules/meal/dto/updateMealDto.ts";
import { SingleMealOutput } from "../dto/mealDto";

type Input = InputFactory<
  { dto: UpdateMealDto },
  { mealRepository: IMealRepositoryUpdate }
>;
type Output = OutputFactory<SingleMealOutput>;

export const UpdateMealUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, meal] = await tryCatch(mealRepository.update(data.dto));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage)

      return UseCaseResponseBuilder.success(200, { menus: [meal], meta: { total: 1, offset: 0, limit: 1 } });
    }
  }
};