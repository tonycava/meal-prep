import { Options } from "$lib/middlewares/authMiddleware.ts";

export type User = {
	apiKey: string;
	apiKeyId: string;
	role: "user" | "admin";
};

export const createUserFromOptions = (options: Options): User => {
	return {
		apiKey: options.apiKey,
		apiKeyId: options.apiKeyId,
		role: options.role as "user" | "admin",
	};
};
