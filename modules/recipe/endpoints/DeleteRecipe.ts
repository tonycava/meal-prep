import { defaultEndpointsFactory } from "express-zod-api";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { deleteRecipeDto } from "../dto/deleteRecipeDto";
import { DeleteRecipeUseCase } from "$modules/recipe/usecases/DeleteRecipe.ts";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { createUserFromOptions } from "$lib/common/User.ts";

export const DeleteRecipeEndPoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "delete",
    input: deleteRecipeDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const deleteRecipeResponse = await DeleteRecipeUseCase({
        recipeRepository: RecipeRepository(createUserFromOptions(options))
      }).execute({ dto: input });
      return ApiResponse.send(deleteRecipeResponse);
    },
  });