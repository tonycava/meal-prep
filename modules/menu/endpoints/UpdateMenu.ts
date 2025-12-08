import { MenuRepository } from "$modules/menu/repositories/MenuRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { UpdateMenuUseCase } from "../usecases/UpdateMenu";
import { createMenuPartialDtoWithId } from "$modules/menu/dto/createMenuDto";

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
