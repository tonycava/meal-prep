import {
  IngredientListQueryDto,
} from "../dto/ingredient.dto";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { ListIngredientsUseCase } from "$modules/ingredient/usecases/ListIngredients.ts";
import { IngredientRepository } from "$modules/ingredient/repositories/IngredientRepository.ts";

export const ListIngredientEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: IngredientListQueryDto,
    output: UseCaseResponseSchema,
    handler: async ({ input: { category, search, limit = 20, offset = 0 }, }) => {
      const listIngredientsResponse = await ListIngredientsUseCase({
        ingredientRepository: IngredientRepository()
      }).execute({ limit, offset, filters: { category, search } });

      return ApiResponse.send(listIngredientsResponse);
    },
  });
