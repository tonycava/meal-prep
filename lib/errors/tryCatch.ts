import { AppError } from "$lib/errors/AppError";

export const tryCatch = async <T>(
  promise: Promise<T>,
): Promise<[error: null, data: T] | [error: AppError, data: null]> => {
  try {
    const result = await promise;
    return [null, result] as const;
  } catch (error) {
    if (error instanceof AppError) return [error, null] as const;
    return [AppError.createUnexpectedError(error), null] as const;
  }
};
