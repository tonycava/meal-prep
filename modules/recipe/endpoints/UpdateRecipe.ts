import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UpdateRecipeUseCase } from "$modules/recipe/usecases/UpdateRecipe";
import { updateRecipeDto } from "$modules/recipe/dto/updateRecipeDto";
import { endpointsFactory } from "../../../lib/common/endpointFactory";
import { createUserFromOptions } from "../../../lib/common/User";

export const UpdateRecipeEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "patch",
    input: updateRecipeDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const deleteRecipeResponse = await UpdateRecipeUseCase({
        recipeRepository: RecipeRepository(createUserFromOptions(options)),
      }).execute({ dto: input });
      return ApiResponse.send(deleteRecipeResponse);
    },
  });
