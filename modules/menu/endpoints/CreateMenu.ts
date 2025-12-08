import { createMenuDto } from "../dto/createMenuDto";
import { SaveMenuUseCase } from "$modules/menu/usecases/SaveMenu";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { createUserFromOptions } from "$lib/common/User";

export const CreateMenuEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createMenuDto,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const saveMenuResponse = await SaveMenuUseCase({
        menuRepository: MenuRepository(createUserFromOptions(options)),
      }).execute({ dto: input });
	
      return ApiResponse.send(saveMenuResponse);
    },
  });
