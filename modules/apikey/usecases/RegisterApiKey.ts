import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IApiKeyRepositoryCreate } from "../interfaces/IApiKeyRepository";
import { RegisterApiKeyInput } from "../dto/registerApiKey.dto";
import { tryCatch } from "$lib/errors/tryCatch";
import { ApiKey } from "@prisma/client";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
  { input: RegisterApiKeyInput },
  { apiKeyRepository: IApiKeyRepositoryCreate }
>;

type Output = OutputFactory<ApiKey>;

export const RegisterApiKeyUseCase: UseCase<Input, Output> = (dependencies) => {
  const { apiKeyRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, apiKey] = await tryCatch(
        apiKeyRepository.create(data.input),
      );

      if (error) {
        return UseCaseResponseBuilder.error(HttpCode.INTERNAL_SERVER_ERROR, error.userFriendlyMessage);
      }

      return UseCaseResponseBuilder.success(HttpCode.INTERNAL_SERVER_ERROR, apiKey);
    },
  };
};
