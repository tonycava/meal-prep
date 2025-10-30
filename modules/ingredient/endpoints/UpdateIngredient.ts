import { defaultEndpointsFactory } from "express-zod-api";
import { UpdateIngredientDto } from "../dto/ingredient.dto";
import { UpdateIngredientUseCase } from "../usecases/UpdateIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "../../../lib/common/usecase";
import { z } from "zod";

export const UpdateIngredientEndpoint = defaultEndpointsFactory.build({
  method: "put",
  input: z.object({
    id: z.string().uuid()
  }).passthrough(),
  output: UseCaseResponseSchema,
  handler: async ({ input, logger }) => {
    const { id, ...dto } = input;
    logger.info("Detected PUT request for ingredient update");
    const updateIngredientResponse = await UpdateIngredientUseCase({
      ingredientRepository: IngredientRepository(),
    }).execute({ id, dto });

    return ApiResponse.send(updateIngredientResponse);
  },
});