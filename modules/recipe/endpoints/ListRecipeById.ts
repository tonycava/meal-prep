import { defaultEndpointsFactory } from "express-zod-api";
import { GetRecipeByIdInputSchema, GetRecipeByIdOutputSchema } from "../dto/recipeDto";
import { RecipeRepository } from "../repositories/RecipeRepository";
import { ListRecipeByIdUseCase } from "../usecases/ListRecipeById";

export const ListRecipeByIdEndpoint = defaultEndpointsFactory.build({
	method: "get",
	input: GetRecipeByIdInputSchema,
	output: GetRecipeByIdOutputSchema,
	handler: async ({ input, logger }) => {
		const { id } = input;

		logger.info(`Fetching recipes with ID: ${id}`);

		const response = await ListRecipeByIdUseCase({
			recipeRepository: RecipeRepository(),
		}).execute({ id });

		if (!response.isSuccess) {
			throw new Error(response.message);
		}

		logger.info(`Fetched recipe with ID: ${id}`);

		return response.data;
	},
});