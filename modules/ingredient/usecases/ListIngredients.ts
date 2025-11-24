import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "$lib/common/usecase.ts";
import { HttpCode } from "$lib/common/api/HttpCode.ts";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { IIngredientFilters, ListIngredientsOutput } from "../dto/ingredient.dto";
import { IIngredientRepositoryList } from "../interfaces/IIngredientRepository";

type Input = InputFactory<
	{ limit: number, offset: number, filters?: IIngredientFilters},
	{ ingredientRepository: IIngredientRepositoryList}
>

type Output = OutputFactory<ListIngredientsOutput>;

export const ListIngredientsUseCase: UseCase<Input, Output> = (dependencies) => {
	const { ingredientRepository } = dependencies;
	return {
		async execute(data): Promise<Output> {
			const[error, result] = await tryCatch(
				ingredientRepository.list(data.limit, data.offset, data.filters || {}),
			);

			if(error) {
				return UseCaseResponseBuilder.error(
					HttpCode.INTERNAL_SERVER_ERROR,
					error.userFriendlyMessage,
				);
			}

			return UseCaseResponseBuilder.success(HttpCode.OK, result);
		}
	}
}

