import { logger } from '../../utils/logger';

export class FallbackValidator {

    static validateFallback(
        response: string,
        fallbackMessages: string[]
    ): void {

        const normalized = response.toLowerCase();

        const matched = fallbackMessages.find(msg =>
            normalized.includes(msg.toLowerCase())
        );

        if (!matched) {
            logger.error(`Fallback validation failed.
Expected one of: ${fallbackMessages.join(', ')}
Actual: ${response}`);

            throw new Error('Fallback validation failed.');
        }

        logger.warn(`Fallback detected: ${matched}`);
    }

    static ensureNoFallback(
        response: string,
        fallbackMessages: string[]
    ): void {

        const normalized = response.toLowerCase();

        const matched = fallbackMessages.find(msg =>
            normalized.includes(msg.toLowerCase())
        );

        if (matched) {
            logger.error(`Unexpected fallback detected: ${matched}
Actual: ${response}`);

            throw new Error('Unexpected fallback detected.');
        }

        logger.info('No fallback detected.');
    }
}
