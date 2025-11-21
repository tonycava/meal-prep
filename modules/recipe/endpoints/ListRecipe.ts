import { ListRecipesInputSchema } from "../dto/recipeDto";
import { ListRecipesUseCase } from "../usecases/ListRecipes";
import { RecipeRepository } from "../repositories/RecipeRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { createUserFromOptions } from "$lib/common/User";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";

export const ListRecipesEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: ListRecipesInputSchema,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const { limit, offset, category, diet, search, ingredients } = input;

      const filters = {
        ...(category && { category }),
        ...(diet && { diet }),
        ...(search && { search }),
        ...(ingredients && { ingredients }),
      };

      const response = await ListRecipesUseCase({
        recipeRepository: RecipeRepository(createUserFromOptions(options)),
      }).execute({
        limit,
        offset,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        apiKey: options.apiKey,
      });

      return ApiResponse.send(response);
    },
  });
