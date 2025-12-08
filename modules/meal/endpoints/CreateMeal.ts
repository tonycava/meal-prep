import { createMealDto } from "../dto/createMealDto";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { SaveMealUseCase } from "../usecases/SaveMeal";
import { MealRepository } from "../repositories/MealRepository";
import {createUserFromOptions} from "$lib/common/User.ts";

export const CreateMealEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createMealDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const saveMealResponse = await SaveMealUseCase({
        mealRepository: MealRepository(createUserFromOptions(options)),
      }).execute({ dto: input });

      return ApiResponse.send(saveMealResponse);
    },
  });
