import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IRecipeRepositoryDelete } from "../interfaces/IRecipeRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";
import { DeleteRecipeDto } from "../dto/deleteRecipeDto";

type Input = InputFactory<
  { dto: DeleteRecipeDto },
  { recipeRepository: IRecipeRepositoryDelete }
>;
type Output = OutputFactory<boolean>;

export const DeleteRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error] = await tryCatch(recipeRepository.delete(data.dto));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage)

      return UseCaseResponseBuilder.success(200, true);
    }
  }
};