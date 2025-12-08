import { endpointsFactory } from "$lib/common/endpointFactory";
import { GetMealByIdInputSchema } from "../dto/mealDto";
import { GetMealByIdUseCase } from "../usecases/ListMealById";
import { MealRepository } from "../repositories/MealRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { createUserFromOptions } from "$lib/common/User";

export const GetMealByIdEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: GetMealByIdInputSchema,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const getMealResponse = await GetMealByIdUseCase({
        mealRepository: MealRepository(createUserFromOptions(options)),
      }).execute({ id: input.id });

      return ApiResponse.send(getMealResponse);
    },
  });
