import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IngredientResponseDtoType } from "../dto/ingredient.dto";
import { IIngredientRepositoryGetById } from "../interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch";

type Input = InputFactory<
  { id: string },
  { ingredientRepository: IIngredientRepositoryGetById }
>;
type Output = OutputFactory<IngredientResponseDtoType>;

export const GetIngredientByIdUseCase: UseCase<Input, Output> = (
  dependencies,
) => {
  const { ingredientRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, ingredient] = await tryCatch(
        ingredientRepository.getById(data.id),
      );
      if (error)
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);
      if (!ingredient)
        return UseCaseResponseBuilder.error(404, "Ingrédient non trouvé");

      return UseCaseResponseBuilder.success(200, ingredient);
    },
  };
};
