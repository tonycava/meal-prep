import { ApiKey } from "@prisma/client";
import { RegisterApiKeyInput } from "../dto/registerApiKey.dto";

export type IApiKeyRepositoryCreate = {
  create(input: RegisterApiKeyInput): Promise<ApiKey>;
};

export type IApiKeyRepository = IApiKeyRepositoryCreate;