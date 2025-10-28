import { AppErrorDefaultLogger } from './AppErrorDefaultLogger';

export type LogLevel = 'error' | 'warn' | 'debug';

export type AppErrorOptions = {
	logger?: (message: string, level: LogLevel) => void;
};

export class AppErrorConfig {
	private static instance: AppErrorConfig;
	private static options: AppErrorOptions;

	private constructor() {
		AppErrorConfig.options ??= {
			logger: AppErrorDefaultLogger
		};
	}

	public static setLogger(logger: (message: string, level: LogLevel) => void) {
		AppErrorConfig.options.logger = logger;
	}

	public static getConfig(): AppErrorOptions {
		if (!AppErrorConfig.instance) {
			AppErrorConfig.instance = new AppErrorConfig();
		}
		return AppErrorConfig.options;
	}
}
