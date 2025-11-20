import { defaultEndpointsFactory } from "express-zod-api";
import { updateMealDto } from "../dto/updateMealDto";
import { z } from "zod";
import { UpdateMealUseCase } from "../usecases/UpdateMeal";
import { MealRepository } from "../repositories/MealRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "../../../lib/common/usecase";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";

export const UpdateMealEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "put",
    input: updateMealDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const updateMealResponse = await UpdateMealUseCase({
        mealRepository: MealRepository(),
      }).execute({ dto: input });

      return ApiResponse.send(updateMealResponse);
    },
  });
