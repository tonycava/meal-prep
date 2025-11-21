import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { deleteRecipeDto } from "../dto/deleteRecipeDto";
import { DeleteRecipeUseCase } from "$modules/recipe/usecases/DeleteRecipe";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { createUserFromOptions } from "$lib/common/User";
import { endpointsFactory } from "$lib/common/endpointFactory";

export const DeleteRecipeEndPoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "delete",
    input: deleteRecipeDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const deleteRecipeResponse = await DeleteRecipeUseCase({
        recipeRepository: RecipeRepository(createUserFromOptions(options)),
      }).execute({ dto: input });
      return ApiResponse.send(deleteRecipeResponse);
    },
  });
