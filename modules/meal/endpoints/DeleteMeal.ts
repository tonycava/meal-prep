import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { deleteMealDto } from "../dto/deleteMealDto";
import { DeleteMealUseCase } from "$modules/meal/usecases/DeleteMeal";
import { MealRepository } from "$modules/meal/repositories/MealRepository";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { createUserFromOptions } from "$lib/common/User.ts";
import { endpointsFactory } from "$lib/common/endpointFactory";

export const DeleteMealEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "delete",
    input: deleteMealDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const deleteMealResponse = await DeleteMealUseCase({
        mealRepository: MealRepository(createUserFromOptions(options)),
      }).execute({ dto: input });
      return ApiResponse.send(deleteMealResponse);
    },
  });
