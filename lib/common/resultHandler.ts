import { ensureHttpError, ResultHandler } from "express-zod-api";
import { z } from "zod";
import { AppError } from "$lib/errors/AppError.ts";
import { HttpCode } from "./api/HttpCode";

export const mealPrepResultHandler = new ResultHandler({
	positive: (data) => ({
		schema: z.object({ data }),
		mimeType: "application/json",
	}),
	negative: z.object({
		status: z.string(),
		error: z.object({ message: z.string() }),
	}),
	handler: ({ error, output, response }) => {
		if (error) {
			const { statusCode, message } = ensureHttpError(error);
			if (statusCode === HttpCode.BAD_REQUEST || statusCode === HttpCode.UNPROCESSABLE_ENTITY) {
				console.log("test2");
				const cleanMessage = message.includes(": ")
					? message.split(": ").slice(0).join(": ")
					: message;
				return void response.status(statusCode).json({
					status: statusCode as number,
					error: { message: cleanMessage },
				});
			}
			if (statusCode === HttpCode.UNAUTHORIZED ||
				statusCode === HttpCode.FORBIDDEN ||
				statusCode === HttpCode.NOT_FOUND ||
				statusCode === HttpCode.CONFLICT) {
				return void response.status(statusCode).json({
					status: statusCode as number,
					error: { message },
				});
			}
			const appError = AppError.createUnexpectedError(error);
			return void response.status(statusCode).json({
				status: statusCode as number,
				error: { message: appError.userFriendlyMessage },
			});
		}

		console.dir(output, { depth: null });
		if ('message' in output && !('data' in output)) {
			return void response.status(output.status as number).json({
				status: output.status as string,
				error: { message: output.message as string },
			});
		}

		const responseData = output.data as any;

		if (responseData && typeof responseData === 'object' && 'meta' in responseData) {
			const { meta, ...rest } = responseData;
			return void response.status(output.status as number).json({
				status: "success",
				data: rest,
				meta
			} as any);
		}

		response.status(output.status as number).json({
			status: output.status as number,
			data: output.data
		} as any);
	}
});
