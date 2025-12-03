import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UpdateRecipeUseCase } from "$modules/recipe/usecases/UpdateRecipe.ts";
import { updateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { createUserFromOptions } from "$lib/common/User";

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
