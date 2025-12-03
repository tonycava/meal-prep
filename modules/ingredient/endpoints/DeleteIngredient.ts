import { DeleteIngredientUseCase } from "../usecases/DeleteIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { z } from "zod";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";

export const DeleteIngredientEndpoint = endpointsFactory
	.addMiddleware(authMiddleware)
	.build({
		method: "delete",
		input: z.object({
			id: z.uuid(),
		}),
		output: UseCaseResponseSchema,
		handler: async ({ input, logger }) => {
			logger.info("Detected DELETE request for ingredient deletion");
			const deleteIngredientResponse = await DeleteIngredientUseCase({
				ingredientRepository: IngredientRepository(),
			}).execute({ id: input.id });

			return ApiResponse.send(deleteIngredientResponse);
		},
	});
