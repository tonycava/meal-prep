import { ListMenusInputSchema } from "../dto/menu.dto.ts";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";
import { ListMenusUseCase } from "$modules/menu/usecases/ListMenus.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";

export const ListMenusEndpoint = endpointsFactory
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
