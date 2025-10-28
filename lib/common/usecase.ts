import { StatusCode } from "../helpers/http.helper";

export type UseCaseResponse<T> =
  | {
  isSuccess: true;
  status: StatusCode;
  message?: string;
  data: T;
}
  | {
  isSuccess: false;
  status: StatusCode;
  message: string;
};

export const UseCaseResponseBuilder = {
  success: <T>(status: StatusCode, data: T, message?: string): UseCaseResponse<T> => ({
    isSuccess: true,
    status,
    data
  }),
  error: <T>(status: StatusCode, message: string): UseCaseResponse<T> => ({
    isSuccess: false,
    status,
    message
  })
};

export type InputFactory<TData, TDeps> = {
  data: TData;
  dependencies: TDeps;
};

export type OutputFactory<T> = UseCaseResponse<T>;

export type UseCase<Input extends { data: unknown; dependencies: unknown }, Output> = (
  dependencies: Input['dependencies']
) => {
  execute(data: Input['data']): Promise<Output>;
};

export type UseCaseSync<Input, Output> = (input: Input) => {
  execute(): Output;
};
