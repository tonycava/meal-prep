import { defaultEndpointsFactory } from "express-zod-api";
import { ListMealsInputSchema, ListMealsOutputSchema } from "../dto/mealDto";
import { ListMealsUseCase } from "../usecases/ListMeals";
import { MealRepository } from "../repositories/MealRepository";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { z } from "zod";

export const ListMealsEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: ListMealsInputSchema,
    output: z.object({ status: z.string(), data: ListMealsOutputSchema }),
    handler: async ({ input, options }) => {
      const { limit, offset, mealType, search } = input;
      
      const filters = {
        ...(mealType && { mealType }),
        ...(search && { search }),
      };

      const response = await ListMealsUseCase({
        mealRepository: MealRepository(),
      }).execute({ limit, offset, filters: Object.keys(filters).length > 0 ? filters : undefined, apiKey: options.apiKey });

      return ApiResponse.send(response);
    },
  });
