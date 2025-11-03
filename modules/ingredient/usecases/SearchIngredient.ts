import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IngredientResponseDtoType } from "../dto/ingredient.dto";
import { IIngredientRepositorySearch } from "../interfaces/IIngredientRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";

type Input = InputFactory<
  { name: string },
  { ingredientRepository: IIngredientRepositorySearch }
>;
type Output = OutputFactory<IngredientResponseDtoType[]>;

export const SearchIngredientUseCase: UseCase<Input, Output> = (dependencies) => {
  const { ingredientRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, ingredients] = await tryCatch(ingredientRepository.searchByName(data.name));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);
      if (!ingredients || ingredients.length === 0) return UseCaseResponseBuilder.error(404, "Aucun ingrédient trouvé");

      return UseCaseResponseBuilder.success(200, ingredients);
    }
  };
};