import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "../../../lib/common/usecase";
import { IIngredientRepositoryDelete } from "../interfaces/IIngredientRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";

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
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);
      if (!deleted)
        return UseCaseResponseBuilder.error(404, "Ingrédient non trouvé");

      return UseCaseResponseBuilder.success(204, undefined);
    },
  };
};
