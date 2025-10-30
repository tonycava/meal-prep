import { defaultEndpointsFactory } from "express-zod-api";
import { ListMenusInputSchema, ListMenusOutputSchema } from "../dto/menu.dto.ts";
import { ListMenusUseCase } from "$modules/menu/usecases/ListMenus.ts";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";

export const ListMenusEndpoint = defaultEndpointsFactory.build({
    method: "get",
    input: ListMenusInputSchema,
    output: ListMenusOutputSchema,
    handler: async ({ input: { per_page, page }, logger }) => {
      logger.info(`Fetching menus with per_page ${per_page} and page ${page}`);

      const listMenusResponse = await ListMenusUseCase({
        menuRepository: MenuRepository(),
      }).execute({ per_page, page });

      logger.info(`Fetched menus successfully`);

      if (!listMenusResponse.isSuccess) {
        throw new Error(listMenusResponse.message);
      }

      return listMenusResponse.data;
    }
});