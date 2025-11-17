import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IRecipeRepositoryUpdate } from "../interfaces/IRecipeRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";

type Input = InputFactory<
  { dto: UpdateRecipeDto },
  { recipeRepository: IRecipeRepositoryUpdate }
>;
type Output = OutputFactory<boolean>;

export const UpdateRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, recipe] = await tryCatch(recipeRepository.update(data.dto));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage)

      return UseCaseResponseBuilder.success(200, true);
    }
  }
};