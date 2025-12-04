import { CreateIngredientDto } from "../dto/ingredient.dto";
import { CreateIngredientUseCase } from "../usecases/CreateIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";

export const CreateIngredientEndpoint = endpointsFactory
	.addMiddleware(authMiddleware)
	.build({
		method: "post",
		input: CreateIngredientDto.describe(
			"Créer un nouvel ingrédient. Champs obligatoires : name (chaîne non vide). Les autres champs sont optionnels avec des valeurs par défaut.",
		),
		output: UseCaseResponseSchema,
		handler: async ({ input }) => {
			const createIngredientResponse = await CreateIngredientUseCase({
				ingredientRepository: IngredientRepository(),
			}).execute({ dto: input });

			return ApiResponse.send(createIngredientResponse);
		},
	});
