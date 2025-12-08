import { updateMealDto } from "../dto/updateMealDto";
import { UpdateMealUseCase } from "../usecases/UpdateMeal";
import { MealRepository } from "../repositories/MealRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "../../../lib/common/usecase";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";
import { createUserFromOptions } from "$lib/common/User.ts";
import { endpointsFactory } from "$lib/common/endpointFactory";

export const UpdateMealEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "put",
    input: updateMealDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const updateMealResponse = await UpdateMealUseCase({
        mealRepository: MealRepository(createUserFromOptions(options)),
      }).execute({ dto: input });

      return ApiResponse.send(updateMealResponse);
    },
  });
