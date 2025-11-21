import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import {
  IngredientResponseDtoType,
  UpdateIngredientDtoType,
} from "../dto/ingredient.dto";
import { IIngredientRepositoryUpdate } from "../interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";

type Input = InputFactory<
  { id: string; dto: UpdateIngredientDtoType },
  { ingredientRepository: IIngredientRepositoryUpdate }
>;
type Output = OutputFactory<IngredientResponseDtoType>;

export const UpdateIngredientUseCase: UseCase<Input, Output> = (
  dependencies,
) => {
  const { ingredientRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, ingredient] = await tryCatch(
        ingredientRepository.update(data.id, data.dto),
      );
      if (error) {
        console.error("Update error:", error);
        if (
          error.message.includes(
            "Unique constraint failed on the fields: (`name`)",
          )
        ) {
          return UseCaseResponseBuilder.error(
            HttpCode.CONFLICT,
            "Un ingrédient avec ce nom existe déjà",
          );
        }
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage || error.message,
        );
      }
      if (!ingredient)
        return UseCaseResponseBuilder.error(
          HttpCode.NOT_FOUND,
          "Ingrédient non trouvé",
        );

      return UseCaseResponseBuilder.success(HttpCode.OK, ingredient);
    },
  };
};
