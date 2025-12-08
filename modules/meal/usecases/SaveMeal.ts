import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "$lib/common/usecase";
import { CreateMealDto } from "../dto/createMealDto";
import { SingleMealOutput } from "../dto/mealDto";
import { IMealRepositorySave } from "../interfaces/IMealRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";

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

      if (error) {
        // Check if it's a Bad Request error (recipes not found)
        if (error.name === "Bad Request") {
          return UseCaseResponseBuilder.error(HttpCode.BAD_REQUEST, error.userFriendlyMessage);
        }
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, error.userFriendlyMessage);
      }

      if (!meal) {
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, "Error during meal creation");
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

      return UseCaseResponseBuilder.success(HttpCode.CREATED, { meals: [mealDto] });
    }
  }
};