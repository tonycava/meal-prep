import { defaultEndpointsFactory } from "express-zod-api";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UpdateRecipeUseCase } from "$modules/recipe/usecases/UpdateRecipe.ts";
import { updateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";

export const UpdateRecipeEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "patch",
    input: updateRecipeDto,
    output: UseCaseResponseSchema,
    handler: async ({ input }) => {
      const deleteRecipeResponse = await UpdateRecipeUseCase({
        recipeRepository: RecipeRepository(),
      }).execute({ dto: input });
      return ApiResponse.send(deleteRecipeResponse);
    },
  });
