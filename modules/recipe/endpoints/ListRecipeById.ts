import {
  GetRecipeByIdInputSchema,
  GetRecipeByIdOutputSchema,
} from "../dto/recipeDto";
import { RecipeRepository } from "../repositories/RecipeRepository";
import { ListRecipeByIdUseCase } from "../usecases/ListRecipeById";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { createUserFromOptions } from "$lib/common/User";
import { authMiddleware } from "$lib/middlewares/authMiddleware";

export const ListRecipeByIdEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: GetRecipeByIdInputSchema,
    output: GetRecipeByIdOutputSchema,
    handler: async ({ input, logger, options }) => {
      const { id } = input;

      logger.info(`Fetching recipes with ID: ${id}`);

      const response = await ListRecipeByIdUseCase({
        recipeRepository: RecipeRepository(createUserFromOptions(options)),
      }).execute({ id, apiKey: options.apiKey });

      if (!response.isSuccess) {
        throw new Error(response.message);
      }

      logger.info(`Fetched recipe with ID: ${id}`);

      return response.data;
    },
  });
