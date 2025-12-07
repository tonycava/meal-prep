import {
	InputFactory,
	OutputFactory,
	UseCase,
	UseCaseResponseBuilder,
} from "../../../lib/common/usecase";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { IRecipeRepositorySave } from "../interfaces/IRecipeRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
	{ dto: CreateRecipeDto },
	{ recipeRepository: IRecipeRepositorySave }
>;
type Output = OutputFactory<Recipe>;

export const SaveRecipeUseCase: UseCase<Input, Output> = (dependencies) => {
	const { recipeRepository } = dependencies;
	return {
		async execute(data): Promise<Output> {
			const [error, recipe] = await tryCatch(recipeRepository.save(data.dto));
			if (error) {
				console.log("Error save recipe du usecase: ", error);
				return UseCaseResponseBuilder.error(
					HttpCode.NOT_FOUND,
					"Ingredient not found",
				);
			}
			if (!recipe) {
				return UseCaseResponseBuilder.error(
					HttpCode.INTERNAL_SERVER_ERROR,
					"Error during recipe creation",
				);
			}
			return UseCaseResponseBuilder.success(HttpCode.CREATED, recipe);
		},
	};
};
