import { defaultEndpointsFactory } from "express-zod-api";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository";
import { ListMenusUseCase } from "$modules/menu/usecases/ListMenus";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { ListMenusInputSchema } from "$modules/menu/dto/menuDto";

export const ListMenusEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: ListMenusInputSchema,
    output: UseCaseResponseSchema,
    handler: async ({ input: { limit, offset }, options, logger }) => {
      logger.info(`Fetching menus with limit ${limit} and offset ${offset}`);

      const response = await ListMenusUseCase({
        menuRepository: MenuRepository(),
      }).execute({ limit, offset, apiKey: options.apiKey, role: options.role });

      return ApiResponse.send(response);
    },
  });
