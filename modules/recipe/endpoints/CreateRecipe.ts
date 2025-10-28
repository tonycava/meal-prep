import { defaultEndpointsFactory } from "express-zod-api";
import { createRecipeDto } from "../dto/createRecipeDto";
import { SaveRecipeUseCase } from "$modules/recipe/usecases/SaveRecipe.ts";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";

export const CreateRecipeEndPoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createRecipeDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const saveRecipeResponse = await SaveRecipeUseCase({
        recipeRepository: RecipeRepository(),
      }).execute({ dto: input, apiKey: options.apiKey });

      return ApiResponse.send(saveRecipeResponse);
    },
  });