import { createRecipeDto } from "../dto/createRecipeDto";
import { ApiResponse } from "$lib/common/api/ApiResponse.ts";
import { UseCaseResponseBuilder } from "$lib/common/usecase.ts";
import { authMiddleware } from "$lib/middlewares/authMiddleware.ts";
import { z } from "zod";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";

export const CreateRecipeEndPoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: createRecipeDto,
    output: z.any(),
    handler: async ({ input, options }) => {
      return ApiResponse.send(UseCaseResponseBuilder.error(400, "Failed to save recipe"));
    },
  });