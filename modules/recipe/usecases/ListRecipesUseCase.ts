import { UseCase, InputFactory, UseCaseResponseBuilder, OutputFactory } from "../../../lib/common/usecase";
import { RecipeQueryDto } from "../dto/recipeQueryDto";
import { IRecipeRepositoryList } from "../interfaces/IRecipeRepository";
import { Recipe } from "../entities/Recipe";
import { tryCatch } from "../../../lib/errors/tryCatch";

type Output = OutputFactory<{ data: Recipe[]; total: number }>;

type Input = InputFactory<
    { query: RecipeQueryDto },
    { recipeRepository: IRecipeRepositoryList }
>;

export const ListRecipesUseCase: UseCase<Input, Output> = (dependencies) => {
    const { recipeRepository } = dependencies;
    return {
        async execute(data): Promise<Output> {
            const [error, result] = await tryCatch(recipeRepository.list(data.query));

            if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

            return UseCaseResponseBuilder.success(200, result);
        }
    }
};