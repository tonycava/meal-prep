import { defaultEndpointsFactory } from "express-zod-api";
import { ListMenusInputSchema, ListMenusOutputSchema } from "../dto/menu.dto.ts";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";
import { ListMenusUseCase } from "$modules/menu/usecases/ListMenus.ts";

export const ListMenusEndpoint = defaultEndpointsFactory.build({
    method: "get",
    input: ListMenusInputSchema,
    output: ListMenusOutputSchema,
    handler: async ({ input: { limit, offset }, logger }) => {
      logger.info(`Fetching menus with limit ${limit} and offset ${offset}`);

      const response = await ListMenusUseCase({
        menuRepository: MenuRepository(),
      }).execute({ limit, offset });

      if (!response.isSuccess) {
        throw new Error(response.message);
      }

      logger.info(`Fetched ${response.data.menus.length} menus`);

      return response.data;
    }
});