import {
	UseCase,
	InputFactory,
	UseCaseResponseBuilder,
	OutputFactory,
} from "$lib/common/usecase";
import { IRecipeRepositoryFindById } from "../interfaces/IRecipeRepository";
import { GetRecipeByIdDto, GetRecipeByIdOutput } from "../dto/recipeDto";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";

type Input = InputFactory<
	{ dto:  GetRecipeByIdDto},
	{ recipeRepository: IRecipeRepositoryFindById }
>;
type Output = OutputFactory<GetRecipeByIdOutput>;

export const ListRecipeByIdUseCase: UseCase<Input, Output> = (dependencies) => {
	const { recipeRepository } = dependencies;
	return {
		async execute(data): Promise<Output> {
			const [error, result] = await tryCatch(
				recipeRepository.findById(data.dto),
			);

			if (error)
				return UseCaseResponseBuilder.error(
					HttpCode.NOT_FOUND,
					error.userFriendlyMessage,
				);

			if (!result) {
				return UseCaseResponseBuilder.error(
					HttpCode.INTERNAL_SERVER_ERROR,
					"An unexpected error occured: no data returned.",
				);
			}
			return UseCaseResponseBuilder.success(HttpCode.OK, result);
		},
	};
};
