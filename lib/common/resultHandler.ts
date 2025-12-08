import { ensureHttpError, ResultHandler } from "express-zod-api";
import { z } from "zod";
import { AppError } from "$lib/errors/AppError";

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

      if (statusCode === 400 || statusCode === 422) {
        const cleanMessage = message.includes(": ")
          ? message.split(": ").slice(1).join(": ")
          : message;

        return void response.status(statusCode).json({
          status: "error",
          error: { message: cleanMessage },
        });
      }

      const appError = AppError.createUnexpectedError(error);
      return void response.status(statusCode).json({
        status: "error",
        error: { message: appError.userFriendlyMessage },
      });
    }

    const data = typeof output.data === "object" ? (output as any).data : { message: (output as any).data || output.message };
    response.status(output.status as number).json({ status: "success", data });
  },
});
