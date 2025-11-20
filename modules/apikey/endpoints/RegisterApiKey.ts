import { defaultEndpointsFactory } from "express-zod-api";
import { RegisterApiKeyInputSchema } from "../dto/registerApiKey.dto";
import { ApiKeyRepository } from "../repositories/ApiKeyRepository";
import { RegisterApiKeyUseCase } from "../usecases/RegisterApiKey";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";

export const RegisterApiKeyEndpoint = defaultEndpointsFactory.build({
  method: "post",
  input: RegisterApiKeyInputSchema,
  output: UseCaseResponseSchema,
  handler: async ({ input, logger }) => {
    logger.info(`Registering new API key with name: ${input.name}`);

    const registerApiKeyResponse = await RegisterApiKeyUseCase({
      apiKeyRepository: ApiKeyRepository(),
    }).execute({ input });

    return ApiResponse.send(registerApiKeyResponse);
  },
});