import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { authMiddleware } from "../../../lib/middlewares/authMiddleware";
import { deleteMenuDto } from "../dto/deleteMenu.dto";
import { DeleteMenuUseCase } from "../usecases/DeleteMenu";
import { MenuRepository } from "../repositories/MenuRepository"
import createHttpError from "http-errors";
import { z } from "zod";
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