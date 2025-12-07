import { createMenuPartialDtoWithId } from "../dto/createMenuDto";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase.ts";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { UpdateMenuUseCase } from "../usecases/UpdateMenu";
import { createUserFromOptions } from "$lib/common/User.ts";

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
