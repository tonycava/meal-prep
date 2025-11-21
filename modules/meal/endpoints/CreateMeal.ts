import createHttpError from "http-errors";
import { endpointsFactory } from "../../../lib/common/endpointFactory";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";
import { createMealDto } from "../dto/createMealDto";
import { SaveMealUseCase } from "../usecases/SaveMeal";
import { MealDTOSchema } from "../dto/mealDto";
import { MealRepository } from "../repositories/MealRepository";
import { z } from "zod";

export const CreateMealEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createMealDto,
    output: z.object({ data: MealDTOSchema }),
    handler: async ({ input, options }) => {
      const saveMealResponse = await SaveMealUseCase({
        mealRepository: MealRepository(),
      }).execute({ dto: input, apiKey: options.apiKey });

      if (!saveMealResponse.isSuccess) {
        throw createHttpError(saveMealResponse.status, saveMealResponse.message);
      }

      return { data: saveMealResponse.data };
    },
  });
