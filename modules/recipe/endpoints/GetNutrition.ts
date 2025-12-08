import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { GetNutrutionUseCase } from "../usecases/GetNutrition";
import { NutritionRepository } from "$modules/recipe/repositories/NutritionRepository";
import { IngredientRepository } from "$modules/recipe/repositories/IngredientRepository";
import { endpointsFactory } from "$lib/common/endpointFactory";
import RateLimit from "$lib/common/api/RateLimit";
import { getByIdDto } from "$lib/common/dto/getByIdDto";
import { RecipeRepository } from "$modules/recipe/repositories/RecipeRepository";
import { createUserFromOptions } from "$lib/common/User";

export const GetNutritionEndPoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .addExpressMiddleware(RateLimit.strictLimiter)
  .build({
    method: "get",
    input: getByIdDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const getNutritionResponse = await GetNutrutionUseCase({
        nutritionRepository: NutritionRepository(),
        ingredientRepository: IngredientRepository(),
        recipeRepository: RecipeRepository(createUserFromOptions(options)),
      }).execute({ dto: input });

      return ApiResponse.send(getNutritionResponse);
    },
  });
