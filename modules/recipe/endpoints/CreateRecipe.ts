import { createRecipeDto } from "../dto/createRecipeDto";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { z } from "zod";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { SaveRecipeUseCase } from "$modules/recipe/usecases/SaveRecipe.ts";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository.ts";
import { createUserFromOptions } from "$lib/common/User.ts";

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
