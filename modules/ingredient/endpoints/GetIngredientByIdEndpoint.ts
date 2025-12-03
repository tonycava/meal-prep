import { z } from "zod";
import { GetIngredientByIdUseCase } from "../usecases/GetIngredientById";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";

export const GetIngredientByIdEndpoint = endpointsFactory
	.build({
		method: "get",
		input: z.object({
			id: z.uuid(),
		}),
		output: UseCaseResponseSchema,
		handler: async ({ input, logger }) => {
			logger.info("Detected GET request for ingredient retrieval");
			const getIngredientResponse = await GetIngredientByIdUseCase({
				ingredientRepository: IngredientRepository(),
			}).execute({ id: input.id });

			return ApiResponse.send(getIngredientResponse);
		},
	});
