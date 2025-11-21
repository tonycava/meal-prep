import { createMenuPartialDtoWithId } from "../dto/createMenu.dto";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { UpdateMenuUseCase } from "../usecases/UpdateMenu";

export const UpdateMenuEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "patch",
    input: createMenuPartialDtoWithId,
    output: UseCaseResponseSchema,
    handler: async ({ input }) => {
      const saveMenuResponse = await UpdateMenuUseCase({
        menuRepository: MenuRepository(),
      }).execute({ dto: input });

      return ApiResponse.send(saveMenuResponse);
    },
  });
