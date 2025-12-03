import {
	InputFactory,
	OutputFactory,
	UseCase,
	UseCaseResponseBuilder,
} from "$lib/common/usecase.ts";
import {
	IngredientResponseDtoType,
	UpdateIngredientDtoType,
} from "../dto/ingredient.dto";
import { IIngredientRepositoryUpdate } from "../interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
	{ dto: UpdateIngredientDtoType },
	{ ingredientRepository: IIngredientRepositoryUpdate }
>;
type Output = OutputFactory<IngredientResponseDtoType>;

export const PatchIngredientUseCase: UseCase<Input, Output> = (dependencies) => {
	const { ingredientRepository } = dependencies;
	return {
		async execute(data): Promise<Output> {
			const [error, ingredient] = await tryCatch(
				ingredientRepository.update(data.dto),
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
						"Ingredient with this name already exists",
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
					"Ingredient not found",
				);

			return UseCaseResponseBuilder.success(HttpCode.OK, ingredient);
		},
	};
};
