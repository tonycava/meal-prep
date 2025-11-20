import { defaultEndpointsFactory } from "express-zod-api";
import { ListMealsInputSchema, ListMealsOutputSchema } from "../dto/mealDto";
import { ListMealsUseCase } from "../usecases/ListMeals";
import { MealRepository } from "../repositories/MealRepository";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";

export const ListMealsEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: ListMealsInputSchema,
    output: ListMealsOutputSchema,
    handler: async ({ input, options, logger }) => {
      const { limit, offset, mealType, search } = input;
      
      const filters = {
        ...(mealType && { mealType }),
        ...(search && { search }),
      };

      logger.info(`Fetching meals with limit ${limit}, offset ${offset}, filters: ${JSON.stringify(filters)}`);

      const response = await ListMealsUseCase({
        mealRepository: MealRepository(),
      }).execute({ limit, offset, filters: Object.keys(filters).length > 0 ? filters : undefined, apiKey: options.apiKey });

      if (!response.isSuccess) {
        throw new Error(response.message);
      }

      logger.info(`Fetched ${response.data.meals.length} meals`);

      return response.data;
    },
  });
