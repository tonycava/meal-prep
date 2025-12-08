import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "../../../lib/common/usecase";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { IRecipeRepositorySave } from "../interfaces/IRecipeRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";

type Input = InputFactory<
  { dto: CreateRecipeDto },
  { recipeRepository: IRecipeRepositorySave }
>;
type Output = OutputFactory<{ recipe: Recipe }>;

export const SaveRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, recipe] = await tryCatch(recipeRepository.save(data.dto));
      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.BAD_REQUEST,
          error.userFriendlyMessage,
        );


      return UseCaseResponseBuilder.success(HttpCode.CREATED, { recipe });
    },
  };
};
