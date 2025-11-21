import { createRecipeDto } from "../dto/createRecipeDto";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { z } from "zod";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { SaveRecipeUseCase } from "$modules/recipe/usecases/SaveRecipe";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository";
import { createUserFromOptions } from "$lib/common/User";

export const CreateRecipeEndPoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createRecipeDto,
    output: z.any(),
    handler: async ({ input, options }) => {
      const createRecipeResponse = await SaveRecipeUseCase({
        recipeRepository: RecipeRepository(createUserFromOptions(options)),
      }).execute({ dto: input });

      return ApiResponse.send(createRecipeResponse);
    },
  });
