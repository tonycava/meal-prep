import { createMenuPartialDtoWithId } from "../dto/createMenuDto";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { UpdateMenuUseCase } from "../usecases/UpdateMenu";
import { createUserFromOptions } from "$lib/common/User";

export const UpdateMenuEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "patch",
    input: createMenuPartialDtoWithId,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const saveMenuResponse = await UpdateMenuUseCase({
        menuRepository: MenuRepository(createUserFromOptions(options)),
      }).execute({ dto: input });

      return ApiResponse.send(saveMenuResponse);
    },
  });
