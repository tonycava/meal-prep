import { z } from "zod";
import { GetIngredientByIdUseCase } from "../usecases/GetIngredientById";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { authMiddleware } from "$lib/middlewares/authMiddleware";

export const GetIngredientByIdEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: z.object({
      id: z.string().uuid(),
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
