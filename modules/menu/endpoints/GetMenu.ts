import { endpointsFactory } from "$lib/common/endpointFactory";
import { GetMenuByIdInputSchema } from "../dto/menuDto";
import { GetMenuUseCase } from "../usecases/GetMenu";
import { MenuRepository } from "../repositories/MenuRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { createUserFromOptions } from "$lib/common/User";

export const GetMenuEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: GetMenuByIdInputSchema,
    output: UseCaseResponseSchema,
    handler: async ({ input, options }) => {
      const getMenuResponse = await GetMenuUseCase({
        menuRepository: MenuRepository(createUserFromOptions(options)),
      }).execute({ id: input.id });

      return ApiResponse.send(getMenuResponse);
    },
  });
