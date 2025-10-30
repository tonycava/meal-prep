import { defaultEndpointsFactory } from "express-zod-api";
import { GetIngredientByIdDto, UpdateIngredientDto } from "../dto/ingredient.dto";
import { GetIngredientByIdUseCase } from "../usecases/GetIngredientById";
import { UpdateIngredientUseCase } from "../usecases/UpdateIngredient";
import { DeleteIngredientUseCase } from "../usecases/DeleteIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "../../../lib/common/usecase";
import { z } from "zod";

export const IngredientByIdEndpoint = defaultEndpointsFactory.build({
  method: ["get", "put"],
  input: z.object({
    id: z.string().uuid()
  }).passthrough(),
  output: UseCaseResponseSchema,
  handler: async ({ input, logger }: any) => {
    const { id, ...data } = input as any;

    if (Object.keys(data).length > 0) {
      logger.info("Detected PUT request for ingredient update");
      const updateIngredientResponse = await UpdateIngredientUseCase({
        ingredientRepository: IngredientRepository(),
      }).execute({ id, dto: data });

      return ApiResponse.send(updateIngredientResponse);
    } else {
      logger.info("Detected GET request for ingredient retrieval");
      const getIngredientResponse = await GetIngredientByIdUseCase({
        ingredientRepository: IngredientRepository(),
      }).execute({ id });

      return ApiResponse.send(getIngredientResponse);
    }
  },
});
