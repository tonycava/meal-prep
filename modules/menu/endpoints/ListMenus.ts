import { defaultEndpointsFactory } from "express-zod-api";
import { ListMenusInputSchema } from "../dto/menuDto";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";
import { ListMenusUseCase } from "$modules/menu/usecases/ListMenus.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import {ApiResponse} from "$lib/common/api/ApiResponse.ts";
import {UseCaseResponseSchema} from "$lib/common/usecase.ts";
import { createUserFromOptions } from "$lib/common/User.ts";

export const ListMenusEndpoint = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: ListMenusInputSchema,
    output: UseCaseResponseSchema,
    handler: async ({ input: { limit, offset }, options, logger }) => {
      logger.info(`Fetching menus with limit ${limit} and offset ${offset}`);

      const response = await ListMenusUseCase({
        menuRepository: MenuRepository(createUserFromOptions(options)),
      }).execute({ limit, offset, role: options.role });

      return ApiResponse.send(response);
    }
});