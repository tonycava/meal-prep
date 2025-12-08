import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { CreateMealDto } from "../dto/createMealDto";
import { IMealRepositorySave } from "../interfaces/IMealRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { Meal } from "$modules/meal/entities/Meal";

type Input = InputFactory<
  { dto: CreateMealDto; apiKey: string },
  { mealRepository: IMealRepositorySave }
>;
type Output = OutputFactory<Meal | null>;

export const SaveMealUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, meal] = await tryCatch(
        mealRepository.save(data.dto, data.apiKey),
      );
      if (error)
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(201, meal);
    },
  };
};
