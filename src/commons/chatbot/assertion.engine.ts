import { IntentValidator } from './intent.validator';
import { FallbackValidator } from './fallback.validator';
import { BookingValidator } from './booking.validator';

export class ChatbotAssertionEngine {

    static validateGreeting(
        response: string,
        expectedKeywords: string[]
    ) {
        IntentValidator.validateByExpectedKeywords(
            response,
            expectedKeywords
        );
    }

    static validateConversationStep(
        response: string,
        stepConfig: any,
        fixture: any
    ) {

        IntentValidator.validateByExpectedKeywords(
            response,
            stepConfig.expectedKeywords
        );

        if (fixture.fallback?.enabled) {
            FallbackValidator.ensureNoFallback(
                response,
                fixture.fallback.messages
            );
        }
    }

    static validateBooking(
        response: string,
        fixture: any
    ) {
        BookingValidator.validateConfirmation(
            response,
            fixture.booking.confirmationKeywords
        );
    }
}
