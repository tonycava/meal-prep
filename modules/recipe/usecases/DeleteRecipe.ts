import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase.ts";
import {
  IRecipeRepositoryDelete,
  IRecipeRepositoryIsUseInOneMenu,
} from "../interfaces/IRecipeRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { DeleteRecipeDto } from "../dto/deleteRecipeDto";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
  { dto: DeleteRecipeDto },
  {
    recipeRepository: IRecipeRepositoryDelete & IRecipeRepositoryIsUseInOneMenu;
  }
>;
type Output = OutputFactory<boolean>;

export const DeleteRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
  const { recipeRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [isUsedError, isUsed] = await tryCatch(
        recipeRepository.isUseInOneMenu(data.dto.id),
      );
      if (isUsedError)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          isUsedError.userFriendlyMessage,
        );
      if (isUsed)
        return UseCaseResponseBuilder.error(
          HttpCode.BAD_REQUEST,
          "Recipe is used in one or more menus and cannot be deleted.",
        );

      const [error] = await tryCatch(recipeRepository.delete(data.dto));
      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );

      return UseCaseResponseBuilder.success(HttpCode.OK, true);
    },
  };
};
