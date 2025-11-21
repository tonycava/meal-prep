import { defaultEndpointsFactory } from "express-zod-api";
import { ListMealsInputSchema } from "../dto/mealDto";
import { ListMealsUseCase } from "../usecases/ListMeals";
import { MealRepository } from "../repositories/MealRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { MealType } from "../../../src/generated/prisma";

export const ListMealsEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: ListMealsInputSchema,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const { limit, offset, mealType, search } = input;

      const filters = {
        ...(mealType && { mealType: mealType as MealType }),
        ...(search && { search }),
      };

      const response = await ListMealsUseCase({
        mealRepository: MealRepository(),
      }).execute({
        limit,
        offset,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        apiKey: options.apiKey,
      });

      return ApiResponse.send(response);
    },
  });
