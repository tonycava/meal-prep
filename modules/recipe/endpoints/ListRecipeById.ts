import {
	GetRecipeByIdInputSchema,
	GetRecipeByIdOutputSchema,
} from "../dto/recipeDto";
import { RecipeRepository } from "../repositories/RecipeRepository";
import { ListRecipeByIdUseCase } from "../usecases/ListRecipeById";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { createUserFromOptions } from "$lib/common/User.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { ApiResponse } from "$lib/common/api/ApiResponse";

export const ListRecipeByIdEndpoint = endpointsFactory
	.addMiddleware(authMiddleware)
	.build({
		method: "get",
		input: GetRecipeByIdInputSchema,
		output: UseCaseResponseSchema,
		handler: async ({ input, options }) => {
			const response = await ListRecipeByIdUseCase({
				recipeRepository: RecipeRepository(createUserFromOptions(options)),
			}).execute({ dto: input });

			return ApiResponse.send(response);
		},
	});
