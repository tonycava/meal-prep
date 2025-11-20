import { defaultEndpointsFactory } from "express-zod-api";
import { createMenuDto } from "../dto/createMenu.dto";
import { SaveMenuUseCase } from "$modules/menu/usecases/SaveMenu.ts";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";
import { MenuWithMealsSchema } from "../dto/menu.dto";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";

export const CreateMenuEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createMenuDto,
    output: MenuWithMealsSchema,
    handler: async ({ input, options }) => {
      const saveMenuResponse = await SaveMenuUseCase({
        menuRepository: MenuRepository(),
      }).execute({ dto: input, apiKey: options.apiKey });

      if (!saveMenuResponse.isSuccess) {
        throw new Error(saveMenuResponse.message);
      }

      return {
        ...saveMenuResponse.data,
        mealCount: saveMenuResponse.data.meals.length,
      };
    },
  });
