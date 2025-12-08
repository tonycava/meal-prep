import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { z } from "zod";
import { UseCaseResponseBuilder } from "../usecase";
import { endpointsFactory } from "$lib/common/endpointFactory";

export const HomeEndpoint = endpointsFactory.build({
  method: "get",
  input: z.any(),
  output: UseCaseResponseSchema,
  handler: async ({ logger }) => {
    logger.info(`Home route`);

    return ApiResponse.send(UseCaseResponseBuilder.success(200, null));
  },
});
