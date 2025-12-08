import { endpointsFactory } from "$lib/common/endpointFactory";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { deleteMenuDto } from "../dto/deleteMenuDto";
import { DeleteMenuUseCase } from "$modules/menu/usecases/DeleteMenu";
import { MenuRepository } from "$modules/menu/repositories/MenuRepository"
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { createUserFromOptions } from "$lib/common/User";

export const DeleteMenuEndpoint = endpointsFactory
	.addMiddleware(authMiddleware)
	.build({
		method: "delete",
		input: deleteMenuDto,
		output: UseCaseResponseSchema,
		handler: async ({ input, options }) => {
			const deleteMenuResponse = await DeleteMenuUseCase({
				menuRepository: MenuRepository(createUserFromOptions(options))
			}).execute({ dto: input });

			return ApiResponse.send(deleteMenuResponse);
		}
	})