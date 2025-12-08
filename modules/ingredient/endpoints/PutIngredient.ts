import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import z from "zod";

export const PutIngredientEndpoint = endpointsFactory
	.addMiddleware(authMiddleware)
	.build({
		method: "put",
		input: patchIngredientDto.omit({ id: true }).extend({
			id: z.uuid("Invalid UUID")
		}),
		output: UseCaseResponseSchema,
		handler: async ({ input, logger }) => {
			logger.info("Detected PATCH request for ingredient update");

			const updateIngredientResponse = await PatchIngredientUseCase({
				ingredientRepository: IngredientRepository(),
			}).execute({
				dto: input as PatchIngredientDtoType
			});

			return ApiResponse.send(updateIngredientResponse);
		},
	});
