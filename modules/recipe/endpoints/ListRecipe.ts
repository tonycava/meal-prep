import { defaultEndpointsFactory } from "express-zod-api";
import { ListRecipesInputSchema, ListRecipesOutputSchema } from "../dto/recipeDto";
import { ListRecipesUseCase } from "../usecases/ListRecipes";
import { RecipeRepository } from "../repositories/RecipeRepository";

export const ListRecipesEndpoint = defaultEndpointsFactory.build({
	method: "get",
	input: ListRecipesInputSchema,
	output: ListRecipesOutputSchema,
	handler: async ({ input, logger }) => {
		const { limit, offset, category, diet, search, ingredients } = input;

		const filters = {
			...(category && { category }),
			...(diet && { diet }),
			...(search && { search }),
			...(ingredients && { ingredients }),
		};

		logger.info(`Fetching recipes with limit ${limit}, offset ${offset}, filters: ${JSON.stringify(filters)}`);

		const response = await ListRecipesUseCase({
			recipeRepository: RecipeRepository(),
		}).execute({ limit, offset, filters: Object.keys(filters).length > 0 ? filters : undefined });

		if (!response.isSuccess) {
			throw new Error(response.message);
		}

		logger.info(`Fetched ${response.data.recipes.length} recipes`);

		return response.data;
	},
});