import {
	InputFactory,
	OutputFactory,
	UseCase,
	UseCaseResponseBuilder,
} from "$lib/common/usecase.ts";
import { IIngredientRepositoryDelete } from "../interfaces/IIngredientRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
	{ id: string },
	{ ingredientRepository: IIngredientRepositoryDelete }
>;
type Output = OutputFactory<{ message: string }>;

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
					"Ingredient not found",
				);

			return UseCaseResponseBuilder.success(HttpCode.OK, { message: "Ingredient deleted successfully" });
		},
	};
};
