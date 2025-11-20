import { defaultEndpointsFactory } from "express-zod-api";
import { DeleteIngredientUseCase } from "../usecases/DeleteIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { z } from "zod";

export const DeleteIngredientEndpoint = defaultEndpointsFactory.build({
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
