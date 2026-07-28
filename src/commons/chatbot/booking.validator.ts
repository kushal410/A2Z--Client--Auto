import { logger } from '../../utils/logger';

export class BookingValidator {

    static validateConfirmation(
        response: string,
        confirmationKeywords: string[],
        minimumMatch = 1
    ): void {

        const normalized = response.toLowerCase();

        const matches = confirmationKeywords.filter(keyword =>
            normalized.includes(keyword.toLowerCase())
        );

        console.log(`[BOOKING VALIDATION] Response: "${response.substring(0, 200)}..."`);
        console.log(`[BOOKING VALIDATION] Keywords searched: [${confirmationKeywords.join(', ')}]`);
        console.log(`[BOOKING VALIDATION] Keywords matched: [${matches.join(', ')}] (${matches.length}/${confirmationKeywords.length})`);

        if (matches.length < minimumMatch) {
            logger.error(`Booking confirmation failed.
                Expected: ${confirmationKeywords.join(', ')}
                Actual: ${response}`);

            throw new Error(
                `Booking confirmation validation failed. ` +
                `Expected at least ${minimumMatch} keyword(s) from [${confirmationKeywords.join(', ')}]. ` +
                `Found: [${matches.join(', ')}]. ` +
                `Bot response: "${response}"`
            );
        }

        logger.info(`Booking confirmed. Matched: ${matches.join(', ')}`);
        console.log(`[BOOKING VALIDATION] ✓ Booking confirmation successful`);
    }
}
