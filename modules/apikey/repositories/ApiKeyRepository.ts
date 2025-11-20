import { prisma } from "$lib/db";
import { ApiKey } from "@prisma/client";
import crypto from "crypto";
import { AppError } from "$lib/errors/AppError";
import { IApiKeyRepository } from "../interfaces/IApiKeyRepository";
import { RegisterApiKeyInput } from "../dto/registerApiKey.dto";

export const ApiKeyRepository = (): IApiKeyRepository => {
  return {
    async create(input: RegisterApiKeyInput): Promise<ApiKey> {
      try {
        const env = process.env.NODE_ENV === "production" ? "live" : "test";
        const key = `sk_${env}_${crypto.randomBytes(32).toString("hex")}`;

        return await prisma.apiKey.create({
          data: {
            key,
            name: input.name,
            role: "user",
            isActive: true,
          },
        });
      } catch (error) {
        console.error("An error occurred while creating API key", error);
        throw new AppError(
          "Internal Server Error",
          "An error occurred while creating API key",
          "Une erreur est survenue lors de la création de la clé API.",
          "error",
        );
      }
    },
  };
};
