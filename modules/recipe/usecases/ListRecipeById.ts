import { UseCase, InputFactory, UseCaseResponseBuilder, OutputFactory } from "../../../lib/common/usecase";
import { IRecipeRepositoryFindById } from "../interfaces/IRecipeRepository";
import { GetRecipeByIdInput, GetRecipeByIdOutput, RecipeDto } from "../dto/recipeDto";
import { tryCatch } from "../../../lib/errors/tryCatch";

type Input = InputFactory<GetRecipeByIdInput, { recipeRepository: IRecipeRepositoryFindById }>;
type Output = OutputFactory<GetRecipeByIdOutput>;

export const ListRecipeByIdUseCase: UseCase<Input, Output> = (dependencies) => {
	const { recipeRepository } = dependencies;
	return {
		async execute(data): Promise<Output> {
			const [error, result] = await tryCatch(recipeRepository.findById(data.id));

			if (error) return UseCaseResponseBuilder.error(error.statusCode || 500, error.userFriendlyMessage);

			if(!result) {
				return UseCaseResponseBuilder.error(500, "An unexpected error occured: no data returned.");
			}
			return UseCaseResponseBuilder.success(200, result);
		}
	}
};