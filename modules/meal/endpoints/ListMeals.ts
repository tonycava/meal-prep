import { endpointsFactory } from "$lib/common/endpointFactory";
import { ListMealsInputSchema } from "../dto/mealDto";
import { ListMealsUseCase } from "../usecases/ListMeals";
import { MealRepository } from "../repositories/MealRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { MealType } from "../../../generated/client";
import {createUserFromOptions} from "$lib/common/User.ts";

export const ListMealsEndpoint = endpointsFactory
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
        mealRepository: MealRepository(createUserFromOptions(options)),
      }).execute({
        limit,
        offset,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      });

      return ApiResponse.send(response);
    },
  });
