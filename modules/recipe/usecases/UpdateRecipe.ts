import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "../../../lib/common/usecase";
import { IRecipeRepositoryUpdate } from "../interfaces/IRecipeRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";
import { HttpCode } from "../../../lib/common/api/HttpCode";

type Input = InputFactory<
  { dto: UpdateRecipeDto },
  { recipeRepository: IRecipeRepositoryUpdate }
>;
type Output = OutputFactory<boolean>;

export const UpdateRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error] = await tryCatch(recipeRepository.update(data.dto));
      if (error)
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(HttpCode.OK, true);
    },
  };
};
