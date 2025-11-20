import { defaultEndpointsFactory } from "express-zod-api";
import {
  GetMealByIdInputSchema,
  GetMealByIdOutputSchema,
} from "../dto/mealDto";
import { GetMealByIdUseCase } from "../usecases/ListMealById";
import { MealRepository } from "../repositories/MealRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "../../../lib/common/usecase";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";

export const GetMealByIdEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: GetMealByIdInputSchema,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const getMealResponse = await GetMealByIdUseCase({
        mealRepository: MealRepository(),
      }).execute({ id: input.id, apiKey: options.apiKey });

      return ApiResponse.send(getMealResponse);
    },
  });
