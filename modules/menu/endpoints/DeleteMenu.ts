import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { deleteMenuDto } from "../dto/deleteMenu.dto";
import { DeleteMenuUseCase } from "../usecases/DeleteMenu";
import { MenuRepository } from "../repositories/MenuRepository"
import createHttpError from "http-errors";
import { z } from "zod";

export const DeleteMenuEndpoint = endpointsFactory
	.authMiddleware(authMiddleware)
	.build({
		method: "delete",
		input: deleteMenuDto,
		output: z.object({ message: z.string() }),
		handler: async ({ input, options, logger }) => {

			const useCase = DeleteMenuUseCase({
				menuRepository: MenuRepository(options.user)
			})

			const response = await useCase.execute({ dto: input });

			if(!response.isSuccess) {
				throw createHttpError(response.status, response.message)
			}

			return { message: "Menu supprimé avec succès" };
		}
	})