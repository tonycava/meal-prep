import {
  AppErrorConfig,
  type AppErrorOptions,
  type LogLevel,
} from "./AppErrorConfig";

export type ErrorCode =
  | "Parse Error"
  | "Bad Request"
  | "Internal Server Error"
  | "Not Implemented"
  | "Unauthorized"
  | "Forbidden"
  | "Not Found"
  | "Method Not Supported"
  | "Timeout"
  | "Conflict"
  | "Precondition Failed"
  | "Payload Too Large"
  | "Unprocessable Content"
  | "Too Many Requests"
  | "Client Closed Request"
  | "Validation Error"
  | (string & {});

export class AppError extends Error {
  private readonly _name: string;
  private readonly _message: string;
  private readonly _userFriendlyMessage: string;
  private readonly _level: LogLevel;

  constructor(
    name: ErrorCode,
    message: string,
    userFriendlyMessage: string,
    level: LogLevel,
    options?: AppErrorOptions,
  ) {
    super(message);
    const { logger } = options ?? AppErrorConfig.getConfig();
    this.name = name;
    this._name = name;
    this._level = level;
    this._message = message;
    this._userFriendlyMessage = userFriendlyMessage;
    logger?.(this._name + ": " + this._message, this._level);
  }

  static createUnexpectedError(error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Unknown error") {
      console.error(error);
    }
    return new AppError(
      "Internal Server Error",
      message,
      "An error from our end occurred, we're deeply sorry for the inconvenience. Please try again later.",
      "error",
    );
  }

  get userFriendlyMessage(): string {
    return this._userFriendlyMessage;
  }
}
