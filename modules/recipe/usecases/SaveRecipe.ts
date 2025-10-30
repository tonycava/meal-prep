import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { IRecipeRepositorySave } from "../interfaces/IRecipeRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";

type Input = InputFactory<
  { dto: CreateRecipeDto; apiKey: string },
  { recipeRepository: IRecipeRepositorySave }
>;
type Output = OutputFactory<Recipe>;

export const SaveRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, recipe] = await tryCatch(recipeRepository.save(data.dto, data.apiKey));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage)

      return UseCaseResponseBuilder.success(200, recipe);
    }
  }
};