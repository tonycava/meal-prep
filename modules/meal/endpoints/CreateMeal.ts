import { createMealDto } from "../dto/createMealDto";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { SaveMealUseCase } from "../usecases/SaveMeal";
import { MealRepository } from "../repositories/MealRepository";
import { SingleMealOutputSchema } from "../dto/mealDto";
import { z } from "zod";

export const CreateMealEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createMealDto,
    output: z.object({ status: z.string(), data: SingleMealOutputSchema }),
    handler: async ({ input, options }) => {
      const saveMealResponse = await SaveMealUseCase({
        mealRepository: MealRepository(),
      }).execute({ dto: input, apiKey: options.apiKey });

      return ApiResponse.send(saveMealResponse);
    },
  });
