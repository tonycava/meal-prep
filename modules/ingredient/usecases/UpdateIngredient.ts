import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IngredientResponseDtoType, UpdateIngredientDtoType } from "../dto/ingredient.dto";
import { IIngredientRepositoryUpdate } from "../interfaces/IIngredientRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";

type Input = InputFactory<
  { id: string; dto: UpdateIngredientDtoType },
  { ingredientRepository: IIngredientRepositoryUpdate }
>;
type Output = OutputFactory<IngredientResponseDtoType>;

export const UpdateIngredientUseCase: UseCase<Input, Output> = (dependencies) => {
  const { ingredientRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, ingredient] = await tryCatch(ingredientRepository.update(data.id, data.dto));
      if (error) {
        console.error("Update error:", error);
        if (error.message.includes("Unique constraint failed on the fields: (`name`)")) {
          return UseCaseResponseBuilder.error(409, "Un ingrédient avec ce nom existe déjà");
        }
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage || error.message);
      }
      if (!ingredient) return UseCaseResponseBuilder.error(404, "Ingrédient non trouvé");

      return UseCaseResponseBuilder.success(200, ingredient);
    }
  };
};