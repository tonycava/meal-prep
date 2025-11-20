import { ensureHttpError, ResultHandler } from "express-zod-api";
import { z } from "zod";
import { AppError } from "$lib/errors/AppError.ts";

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
      const { statusCode } = ensureHttpError(error);
      const appError = AppError.createUnexpectedError(error);
      return void response.status(statusCode).json({
        status: "error",
        error: { message: appError.userFriendlyMessage },
      });
    }
    console.log(output);
    response.status(output.status as number).json({ data: output });
  },
});
