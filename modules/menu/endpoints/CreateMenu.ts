import { createMenuDto } from "../dto/createMenu.dto";
import { SaveMenuUseCase } from "$modules/menu/usecases/SaveMenu.ts";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import {endpointsFactory} from "$lib/common/endpointFactory.ts";

export const CreateMenuEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createMenuDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const saveMenuResponse = await SaveMenuUseCase({
        menuRepository: MenuRepository(),
      }).execute({ dto: input, apiKey: options.apiKey });

      return ApiResponse.send(saveMenuResponse);
    },
  });
