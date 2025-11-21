import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IRecipeRepositoryDelete, IRecipeRepositoryIsUseInOneMenu } from "../interfaces/IRecipeRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";
import { DeleteRecipeDto } from "../dto/deleteRecipeDto";

type Input = InputFactory<
	{ dto: DeleteRecipeDto },
	{ recipeRepository: IRecipeRepositoryDelete & IRecipeRepositoryIsUseInOneMenu }
>;
type Output = OutputFactory<boolean>;

export const DeleteRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
	const { recipeRepository } = dependencies;
	return {
		async execute(data): Promise<Output> {
			const [isUsedError, isUsed] = await tryCatch(recipeRepository.isUseInOneMenu(data.dto.id));
			if (isUsedError) return UseCaseResponseBuilder.error(500, isUsedError.userFriendlyMessage)
			if (isUsed) return UseCaseResponseBuilder.error(400, "Recipe is used in one or more menus and cannot be deleted.");

			const [error] = await tryCatch(recipeRepository.delete(data.dto));
			if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage)

			return UseCaseResponseBuilder.success(200, true);
		}
	}
};