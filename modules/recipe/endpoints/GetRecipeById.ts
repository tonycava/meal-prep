import { RecipeRepository } from "../repositories/RecipeRepository";
import { GetRecipeByIdUseCase } from "../usecases/GetRecipeById";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { createUserFromOptions } from "$lib/common/User";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { getByIdDto } from "$lib/common/dto/getByIdDto";

export const GetRecipeByIdEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: getByIdDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const getRecipeByIdResponse = await GetRecipeByIdUseCase({
        recipeRepository: RecipeRepository(createUserFromOptions(options)),
      }).execute({ id: input.id, apiKey: options.apiKey });

      return ApiResponse.send(getRecipeByIdResponse);
    },
  });
