import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IIngredientRepositoryDelete } from "../interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";

type Input = InputFactory<
  { id: string },
  { ingredientRepository: IIngredientRepositoryDelete }
>;
type Output = OutputFactory<void>;

export const DeleteIngredientUseCase: UseCase<Input, Output> = (
  dependencies,
) => {
  const { ingredientRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, deleted] = await tryCatch(
        ingredientRepository.delete(data.id),
      );
      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );
      if (!deleted)
        return UseCaseResponseBuilder.error(
          HttpCode.NOT_FOUND,
          "Ingrédient non trouvé",
        );

      return UseCaseResponseBuilder.success(HttpCode.NO_CONTENT, undefined);
    },
  };
};
