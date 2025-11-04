import { defaultEndpointsFactory } from "express-zod-api";
import { ListRecipesInputSchema, ListRecipesOutputSchema } from "../dto/recipeDto";
import { ListRecipesUseCase } from "../usecases/ListRecipes";
import { RecipeRepository } from "../repositories/RecipeRepository";

export const ListRecipesEndpoint = defaultEndpointsFactory.build({
      method: "get",
      input: ListRecipesInputSchema,
      output: ListRecipesOutputSchema,
      handler: async ({ input: { limit, offset, filters }, logger }) => {
		logger.info(`Fetching recipes with limit ${limit}, offset ${offset}, filters: ${JSON.stringify(filters)}`);

            const response = await ListRecipesUseCase({
                  recipeRepository: RecipeRepository(),
            }).execute({ limit, offset, filters });

            if(!response.isSuccess) {
			throw new Error(response.message);
		}

		logger.info(`Fetched ${response.data.recipes.length} recipes`);

		return response.data;
      },
});