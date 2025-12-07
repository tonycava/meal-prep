import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { CreateMealDto } from "../dto/createMealDto";
import { SingleMealOutput } from "../dto/mealDto";
import { IMealRepositorySave } from "../interfaces/IMealRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";

type Input = InputFactory<
  { dto: CreateMealDto; },
  { mealRepository: IMealRepositorySave }
>;
type Output = OutputFactory<SingleMealOutput>;

export const SaveMealUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, meal] = await tryCatch(mealRepository.save(data.dto));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage)

      return UseCaseResponseBuilder.success(201, { menus: [meal], meta: { total: 1, offset: 0, limit: 1 } });
    }
  }
};