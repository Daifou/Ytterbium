import { logger } from './logger';

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function handleError(error: unknown) {
    if (error instanceof AppError) {
        logger.error(`AppError: ${error.message}`, { statusCode: error.statusCode, code: error.code });
        return new Response(JSON.stringify({ error: error.message, code: error.code }), {
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (error instanceof Error) {
        logger.error(`Unhandled Error: ${error.message}`, error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    logger.error('Unknown Error', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
}
