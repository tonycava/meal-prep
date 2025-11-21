import {
  UseCase,
  InputFactory,
  UseCaseResponseBuilder,
  OutputFactory,
} from "../../../lib/common/usecase";
import { IMealRepositoryFindById } from "../interfaces/IMealRepository";
import { SingleMealOutput } from "../dto/mealDto";
import { tryCatch } from "../../../lib/errors/tryCatch";

type Input = InputFactory<
  { id: string; apiKey: string },
  { mealRepository: IMealRepositoryFindById }
>;
type Output = OutputFactory<SingleMealOutput>;

export const GetMealByIdUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(
        mealRepository.findById(data.id, data.apiKey)
      );

      if (error)
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      if (!result) {
        return UseCaseResponseBuilder.error(404, "Meal not found");
      }
      return UseCaseResponseBuilder.success(200, { menus: [result], meta: { total: 1, offset: 0, limit: 1 } });
    },
  };
};
