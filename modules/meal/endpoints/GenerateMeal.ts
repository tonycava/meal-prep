import { endpointsFactory } from "$lib/common/endpointFactory";
import {
  GenerateMealInputSchema,
  GenerateMealResponseSchema,
  IMealGenerationFilters,
} from "../dto/generateMealDto";
import { GenerateMealUseCase } from "../usecases/GenerateMeal";
import { MealRepository } from "../repositories/MealRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { createUserFromOptions } from "$lib/common/User";
import createHttpError from "http-errors";

export const GenerateMealEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: GenerateMealInputSchema,
    output: GenerateMealResponseSchema,
    handler: async ({ input, options }) => {
      const {
        mealType,
        diet,
        caloriesMin,
        caloriesMax,
        proteinsMin,
        proteinsMax,
        fatsMin,
        fatsMax,
        carbsMin,
        carbsMax,
        sugarsMin,
        sugarsMax,
        fiberMin,
        fiberMax,
        saltMin,
        saltMax,
      } = input;

      const filters: IMealGenerationFilters = {
        diet,
        caloriesMin,
        caloriesMax,
        proteinsMin,
        proteinsMax,
        fatsMin,
        fatsMax,
        carbsMin,
        carbsMax,
        sugarsMin,
        sugarsMax,
        fiberMin,
        fiberMax,
        saltMin,
        saltMax,
      };

      const response = await GenerateMealUseCase({
        mealRepository: MealRepository(createUserFromOptions(options)),
      }).execute({
        mealType,
        filters,
      });

      if (!response.isSuccess) {
        throw createHttpError(response.status, response.message);
      }

      const queryParams = new URLSearchParams();
      if (mealType) queryParams.set("mealType", mealType);
      if (diet) queryParams.set("diet", diet);
      if (caloriesMin) queryParams.set("caloriesMin", caloriesMin.toString());
      if (caloriesMax) queryParams.set("caloriesMax", caloriesMax.toString());
      if (proteinsMin) queryParams.set("proteinsMin", proteinsMin.toString());
      if (proteinsMax) queryParams.set("proteinsMax", proteinsMax.toString());
      if (fatsMin) queryParams.set("fatsMin", fatsMin.toString());
      if (fatsMax) queryParams.set("fatsMax", fatsMax.toString());
      if (carbsMin) queryParams.set("carbsMin", carbsMin.toString());
      if (carbsMax) queryParams.set("carbsMax", carbsMax.toString());
      if (sugarsMin) queryParams.set("sugarsMin", sugarsMin.toString());
      if (sugarsMax) queryParams.set("sugarsMax", sugarsMax.toString());
      if (fiberMin) queryParams.set("fiberMin", fiberMin.toString());
      if (fiberMax) queryParams.set("fiberMax", fiberMax.toString());
      if (saltMin) queryParams.set("saltMin", saltMin.toString());
      if (saltMax) queryParams.set("saltMax", saltMax.toString());

      const selfUrl = `/v1/meals/generate${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      return {
        status: 200 as const,
        data: response.data!,
        _links: {
          self: {
            href: selfUrl,
            method: "GET" as const,
            title: "Régénérer le repas (Retry)",
          },
          save: {
            href: "/v1/meals",
            method: "POST" as const,
            title: "Valider et sauvegarder le repas",
          },
        },
      };
    },
  });
