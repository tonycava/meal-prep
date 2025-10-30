import { defaultEndpointsFactory } from "express-zod-api";
import { CreateIngredientDto } from "../dto/ingredient.dto";
import { CreateIngredientUseCase } from "../usecases/CreateIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "../../../lib/common/usecase";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";

export const CreateIngredientEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: CreateIngredientDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const createIngredientResponse = await CreateIngredientUseCase({
        ingredientRepository: IngredientRepository(),
      }).execute({ dto: input });

      return ApiResponse.send(createIngredientResponse);
    },
  });