type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private format(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const payload: any = {
            timestamp,
            level: level.toUpperCase(),
            message,
        };

        if (data) {
            if (data instanceof Error) {
                payload.error = {
                    message: data.message,
                    stack: data.stack,
                    name: data.name
                };
            } else {
                payload.data = data;
            }
        }

        return JSON.stringify(payload);
    }

    info(message: string, data?: any) {
        console.log(this.format('info', message, data));
    }

    warn(message: string, data?: any) {
        console.warn(this.format('warn', message, data));
    }

    error(message: string, data?: any) {
        console.error(this.format('error', message, data));
    }

    debug(message: string, data?: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.format('debug', message, data));
        }
    }
}

export const logger = new Logger();
