import { endpointsFactory } from "$lib/common/endpointFactory";
import {
  GenerateMenuInputSchema,
  GenerateMenuResponseSchema,
  IMenuGenerationFilters,
} from "../dto/generateMenuDto";
import { GenerateMenuUseCase } from "../usecases/GenerateMenu";
import { MenuRepository } from "../repositories/MenuRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { createUserFromOptions } from "$lib/common/User";
import createHttpError from "http-errors";

export const GenerateMenuEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: GenerateMenuInputSchema,
    output: GenerateMenuResponseSchema,
    handler: async ({ input, options }) => {
      const { duration, diet, caloriesMin, caloriesMax, proteinsMin, proteinsMax, fatsMin, fatsMax, carbsMin, carbsMax, sugarsMin, sugarsMax, fiberMin, fiberMax, saltMin, saltMax, } = input;

      const filters: IMenuGenerationFilters = { diet, caloriesMin, caloriesMax, proteinsMin, proteinsMax, fatsMin, fatsMax, carbsMin, carbsMax, sugarsMin, sugarsMax, fiberMin, fiberMax, saltMin, saltMax, };

      const response = await GenerateMenuUseCase({
        menuRepository: MenuRepository(createUserFromOptions(options)),
      }).execute({
        duration,
        filters,
      });

      if (!response.isSuccess) {
        throw createHttpError(response.status, response.message);
      }

      const queryParams = new URLSearchParams();
      if (duration) queryParams.set("duration", duration.toString());
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

      const selfUrl = `/v1/menus/generate${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      return {
        status: 200,
        data: response.data!,
        _links: {
          self: {
            href: selfUrl,
            method: "GET" as const,
            title: "Régénérer le menu (Retry)",
          },
          save: {
            href: "/v1/menus",
            method: "POST" as const,
            title: "Valider et sauvegarder le menu",
          },
        },
      };
    },
  });
