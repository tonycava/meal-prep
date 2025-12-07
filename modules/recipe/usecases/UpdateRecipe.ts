import {
	InputFactory,
	OutputFactory,
	UseCase,
	UseCaseResponseBuilder,
} from "../../../lib/common/usecase";
import { IRecipeRepositoryUpdate } from "../interfaces/IRecipeRepository";
import { tryCatch } from "$lib/errors/tryCatch.ts";
import { UpdateRecipeDto, UpdateRecipeOutput } from "$modules/recipe/dto/updateRecipeDto.ts";
import { HttpCode } from "../../../lib/common/api/HttpCode";

type Input = InputFactory<
	{ dto: UpdateRecipeDto },
	{ recipeRepository: IRecipeRepositoryUpdate }
>;
type Output = OutputFactory<UpdateRecipeOutput>;

export const UpdateRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
	const { recipeRepository } = dependencies;
	return {
		async execute(data): Promise<Output> {
			const [error, result] = await tryCatch(recipeRepository.update(data.dto));
			if (error)
				return UseCaseResponseBuilder.error(
					HttpCode.NOT_FOUND,
					error.userFriendlyMessage
				);

			if (!result)
				return UseCaseResponseBuilder.error(
					HttpCode.INTERNAL_SERVER_ERROR,
					"Error during recipe update"
				);

			return UseCaseResponseBuilder.success(HttpCode.OK, result);
		},
	};
};
