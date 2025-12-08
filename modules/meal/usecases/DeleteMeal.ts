import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IMealRepositoryDelete } from "../interfaces/IMealRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { DeleteMealDto } from "../dto/deleteMealDto";
import { HttpCode } from "$lib/common/api/HttpCode";

type Input = InputFactory<
  { dto: DeleteMealDto },
  { mealRepository: IMealRepositoryDelete }
>;
type Output = OutputFactory<{ message: string }>;

export const DeleteMealUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error] = await tryCatch(mealRepository.delete(data.dto));

      if (error) {
        // Check if it's a Not Found error
        if (error.name === "Not Found") {
          return UseCaseResponseBuilder.error(HttpCode.NOT_FOUND, error.userFriendlyMessage);
        }
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, error.userFriendlyMessage);
      }

      return UseCaseResponseBuilder.success(HttpCode.OK, {
        message: "Meal deleted successfully",
      });
    },
  };
};
