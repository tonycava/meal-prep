import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { getNutritionDto } from "../dto/getNutritionDto";
import { GetNutrutionUseCase } from "../usecases/GetNutrition";
import { NutritionRepository } from "$modules/recipe/repositories/NutritionRepository.ts";
import { IngredientRepository } from "$modules/recipe/repositories/IngredientRepository.ts";
import { endpointsFactory } from "../../../lib/common/endpointFactory";
import RateLimit from "../../../lib/common/api/RateLimit";

export const GetNutritionEndPoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .addExpressMiddleware(RateLimit.strictLimiter)
  .build({
    method: "get",
    input: getNutritionDto,
    output: UseCaseResponseSchema,
    handler: async ({ input }) => {
      const getNutritionResponse = await GetNutrutionUseCase({
        nutritionRepository: NutritionRepository(),
        ingredientRepository: IngredientRepository(),
      }).execute({ dto: input });
      return ApiResponse.send(getNutritionResponse);
    },
  });
