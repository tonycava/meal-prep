import {
	InputFactory,
	OutputFactory,
	UseCase,
	UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IngredientResponseDtoType } from "../dto/ingredient.dto";
import { IIngredientRepositoryGetById } from "../interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";

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
				return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, error.userFriendlyMessage);
			if (!ingredient)
				return UseCaseResponseBuilder.error(HttpCode.NOT_FOUND, "Ingredient not found");

			return UseCaseResponseBuilder.success(HttpCode.OK, ingredient);
		},
	};
};
