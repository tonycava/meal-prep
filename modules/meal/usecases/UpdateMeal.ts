import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "$lib/common/usecase";
import { IMealRepositoryUpdate } from "../interfaces/IMealRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { UpdateMealDto } from "$modules/meal/dto/updateMealDto";
import { SingleMealOutput } from "../dto/mealDto";
import { HttpCode } from "$lib/common/api/HttpCode";

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

      if (error) {
        // Check if it's a Not Found error
        if (error.name === "Not Found") {
          return UseCaseResponseBuilder.error(HttpCode.NOT_FOUND, error.userFriendlyMessage);
        }
        // Check if it's a Bad Request error (recipes not found)
        if (error.name === "Bad Request") {
          return UseCaseResponseBuilder.error(HttpCode.BAD_REQUEST, error.userFriendlyMessage);
        }
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, error.userFriendlyMessage);
      }

      if (!meal) {
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, "Error during meal update");
      }

      const mealDto = {
        id: meal.id,
        mealType: meal.mealType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recipeMeals: meal.recipeMeals.map((rm) => ({
          recipeId: rm.recipeId,
          type: rm.type as any,
        })),
      };

      return UseCaseResponseBuilder.success(HttpCode.OK, { meals: [mealDto] });
    }
  }
};