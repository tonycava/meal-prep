import { defaultEndpointsFactory } from "express-zod-api";
import {
  GetMealByIdInputSchema,
  SingleMealOutputSchema,
} from "../dto/mealDto";
import { GetMealByIdUseCase } from "../usecases/ListMealById";
import { MealRepository } from "../repositories/MealRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { z } from "zod";
import { createUserFromOptions } from "$lib/common/User.ts";

export const GetMealByIdEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: GetMealByIdInputSchema,
    output: z.object({ status: z.string(), data: SingleMealOutputSchema }),
    handler: async ({ input, options }) => {
      const getMealResponse = await GetMealByIdUseCase({
        mealRepository: MealRepository(createUserFromOptions(options)),
      }).execute({ id: input.id });

      return ApiResponse.send(getMealResponse);
    },
  });
