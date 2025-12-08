import { defaultEndpointsFactory } from "express-zod-api";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { deleteMealDto } from "../dto/deleteMealDto";
import { DeleteMealUseCase } from "$modules/meal/usecases/DeleteMeal";
import { MealRepository } from "$modules/meal/repositories/MealRepository";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { ApiResponse } from "$lib/common/api/ApiResponse";

export const DeleteMealEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "delete",
    input: deleteMealDto,
    output: UseCaseResponseSchema,
    handler: async ({ input }) => {
      const deleteMealResponse = await DeleteMealUseCase({
        mealRepository: MealRepository(),
      }).execute({ dto: input });
      return ApiResponse.send(deleteMealResponse);
    },
  });
