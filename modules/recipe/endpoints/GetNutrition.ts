import { defaultEndpointsFactory } from "express-zod-api";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { getNutritionDto } from "../dto/getNutritionDto";
import { GetNutrutionUseCase } from "../usecases/GetNutrition";
import { NutritionRepository } from "$modules/recipe/repositories/NutritionRepository.ts";
import { IngredientRepository } from "$modules/recipe/repositories/IngredientRepository.ts";

export const GetNutritionEndPoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
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
