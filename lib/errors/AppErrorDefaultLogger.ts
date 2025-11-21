import type { LogLevel } from "./AppErrorConfig";

export const AppErrorDefaultLogger = (message: string, level: LogLevel) => {
  if (level === "error")
    return console.error("\x1b[31mAppError:  \x1b[0m" + message);
  if (level === "warn")
    return console.warn("\x1b[33mAppWarn:   \x1b[0m" + message);
  if (level === "debug")
    return console.debug("\x1b[36mAppDebug:  \x1b[0m" + message);

  // color this using ANSI escape codes
  // \x1b[31m = red for errors
  // \x1b[33m = yellow for warnings
  // \x1b[36m = cyan for debug
  // \x1b[0m = reset color
};
