import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase.ts";
import {
  IngredientResponseDtoType,
  CreateIngredientDtoType,
} from "../dto/ingredient.dto";
import { IIngredientRepositoryCreate } from "../interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
  { dto: CreateIngredientDtoType },
  { ingredientRepository: IIngredientRepositoryCreate }
>;
type Output = OutputFactory<IngredientResponseDtoType>;

export const CreateIngredientUseCase: UseCase<Input, Output> = (
  dependencies,
) => {
  const { ingredientRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, ingredient] = await tryCatch(
        ingredientRepository.create(data.dto),
      );
      if (error) {
        console.error("Create error:", error);
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
          HttpCode.INTERNAL_SERVER_ERROR,
          "Erreur lors de la création de l'ingrédient",
        );

      return UseCaseResponseBuilder.success(HttpCode.CREATED, ingredient);
    },
  };
};
