import type { UseCaseResponse } from "$lib/common/usecase";

export const ApiResponse = {
  send: (useCaseResponse: UseCaseResponse<unknown>) => {
    if (useCaseResponse.isSuccess) {
      return {
        status: useCaseResponse.status,
        data: useCaseResponse.data,
        message: useCaseResponse.message,
      };
    }

    return {
      status: useCaseResponse.status,
      message: useCaseResponse.message
    }
  }
}
