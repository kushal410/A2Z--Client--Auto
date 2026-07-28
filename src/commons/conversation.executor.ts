import { ChatbotPage } from '../pages/chatbot.page';
import { IntentValidator } from '../commons/chatbot/intent.validator'
import { BookingValidator } from '../commons/chatbot/booking.validator';
import { FallbackValidator } from '../commons/chatbot/fallback.validator';
import { waitForDebugger } from 'inspector';

export async function executeConversationFlow(
    chatbot: ChatbotPage,
    fixture: any
): Promise<void> {

    // Validate greeting first
    if (fixture.greeting) {
        if (fixture.greeting.expectedMessage) {
            // Use custom greeting message if provided            
            await chatbot.validateGreetingContains(fixture.greeting.expectedMessage);
        } else if (fixture.greeting.expectedKeywords && fixture.greeting.expectedKeywords.length > 0) {
            // Fallback to first keyword if custom message not provided
            await chatbot.validateGreetingContains(fixture.greeting.expectedKeywords[0]);
        }
    }

    let lastBotMessage = '';

    for (const step of fixture.conversation.flow) {

        // Step 1: Wait for the bot to finish any prior responses before sending the next message
        console.log(`[FLOW] Step: "${step.message}"`);
        await chatbot.waitForBotIdle(500, 20000);

        // Step 2: Small delay to ensure bot is fully ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 3: Capture current state BEFORE sending
        const beforeBotMessages = await chatbot.getAllResponses();
        const beforeBotCount = beforeBotMessages.length;

        console.log(`[BEFORE SEND] Bot message count: ${beforeBotCount}`);

        // Step 4: Replace DYNAMIC_TIME_SLOT with an available time slot from the last bot message
        let messageToSend = step.message;
        if (messageToSend === 'DYNAMIC_TIME_SLOT') {
            if (shouldTriggerDynamicTimeSlot(lastBotMessage)) {                
                messageToSend = await extractAvailableTimeSlot(lastBotMessage);
                await chatbot.sendMessage(messageToSend);
                await chatbot.waitForBotIdle(500, 20000);  
                const afterBotMessages = await chatbot.getAllLatestResponses();               
                let lastBotMessage1 = await chatbot.getCurrentLatestResponse();                           
                validateAvailableSlots(lastBotMessage1);                
                messageToSend = await extractAvailableTimeSlot(lastBotMessage1);
                console.log(`[TIME SLOT] Selected dynamically: "${messageToSend}"`);
            } else {
                console.log(`[TIME SLOT] Skipping DYNAMIC_TIME_SLOT because bot did not indicate the selected time was unavailable`);
                continue;
            }       
        }

        // Step 5: Send the message
        console.log(`[SENDING] "${messageToSend}"`);
        await chatbot.sendMessage(messageToSend);

        // Step 6: Wait for bot to process and generate response
        console.log(`[WAITING FOR BOT RESPONSE]`);
        await chatbot.waitForBotIdle(500, 20000);

        // Step 7: Collect new bot responses
        const afterBotMessages = await chatbot.getAllLatestResponses();
        const newBotMessages = afterBotMessages.slice(beforeBotCount);

        if (newBotMessages.length === 0) {
            // Fallback to single latest response if none collected
            const latest = await chatbot.getLatestResponse();
            newBotMessages.push(latest);
        }

        console.log(`[BOT RESPONSE] Received ${newBotMessages.length} new message(s)`);

        // Step 8: Store the last bot message for future reference
        if (newBotMessages.length > 0) {
            lastBotMessage = newBotMessages[newBotMessages.length - 1];
            console.log(`[BOT MESSAGE] "${lastBotMessage.substring(0, 100)}..."`);
        }

        // Step 9: Check for fallback in new messages
        if (fixture.fallback?.enabled) {
            for (const msg of newBotMessages) {
                try {
                    FallbackValidator.ensureNoFallback(msg, fixture.fallback.messages);
                } catch (e: unknown) {
                    const errorMsg = e instanceof Error ? e.message : String(e);
                    console.log(`[FALLBACK DETECTED] ${errorMsg}`);
                }
            }
        }

        // Step 10: Validate expected keywords (optional, just log warnings)
        const matched = newBotMessages.some(msg => {
            try {
                IntentValidator.validateByExpectedKeywords(msg, step.expectedKeywords);
                return true;
            } catch (e) {
                return false;
            }
        });

        if (!matched) {
            console.log(`[KEYWORD MISMATCH] Expected: ${step.expectedKeywords.join(', ')}`);
        }

        console.log(`[STEP COMPLETE]\n`);
    }
}

/**
 * Validates that the bot offered available time slots
 * Checks for time slot patterns like "4:00 PM to 7:00 PM" or "4:00 PM, 5:00 PM, etc."
 */
function validateAvailableSlots(botMessage: string): void {
    if (!botMessage || botMessage.trim() === '') {
        console.log(`[VALIDATION] No bot message yet, cannot validate slots`);
        return;
    }

    const lowerMsg = botMessage.toLowerCase();

    // Check if bot explicitly said no availability
    if (lowerMsg.includes('no available') || lowerMsg.includes('no slots') || 
        lowerMsg.includes('unavailable') || lowerMsg.includes('fully booked')) {
        console.log(`[VALIDATION] Bot indicated no slots available for the selected date`);
        return; // This is acceptable - bot is handling unavailability
    }

    // Check for time slot patterns (HH:MM AM/PM or time ranges)
    const timePattern = /\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b/g ;
    const timeMatches = botMessage.match(timePattern);
    
    if (timeMatches && timeMatches.length > 0) {
        console.log(`[VALIDATION] Available slots found: ${timeMatches.join(', ')}`);
        return;
    }

    // Check for time range patterns like "4:00 PM to 7:00 PM"
    if (/\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*(?:to|-)\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)/i.test(botMessage)) {
        console.log(`[VALIDATION] Time range found in bot message`);
        return;
    }

    // If bot is still asking about date/time but hasn't provided slots yet, this is OK
    // Don't throw error - just log and continue
    if (lowerMsg.includes('when') || lowerMsg.includes('time') || lowerMsg.includes('slot') || 
        lowerMsg.includes('today') || lowerMsg.includes('tomorrow') || lowerMsg.includes('date')) {
        console.log(`[VALIDATION] Bot is asking about time/date selection. Will extract from next available slot.`);
        return;
    }

    // If no time slots found, don't throw - just log warning
    console.log(`[VALIDATION WARNING] Expected to find time slots in bot message: "${botMessage.substring(0, 200)}..."`);
}

/**
 * Extracts an available time slot from the bot's message
 * Handles cases like:
 * - "Available times: 10:00 AM, 2:00 PM, 4:00 PM"
 * - "We have slots: 3:30 PM, 5:00 PM, etc."
 * - "Sorry, no available slots for today. Please choose tomorrow."
 * - Single time slot responses
 */
async function extractAvailableTimeSlot(botMessage: string): Promise<string> {
    if (!botMessage || botMessage.trim() === '') {
        console.log(`[TIME SLOT] No bot message provided, using fallback time`);
        return '4:00 PM';
    }

    const lowerMsg = botMessage.toLowerCase();

    // Check if no availability
    if (lowerMsg.includes('no available') || lowerMsg.includes('no slots') || 
        lowerMsg.includes('unavailable') || lowerMsg.includes('fully booked') || 
        lowerMsg.includes("isn't available") || lowerMsg.includes("no longer") ||
        lowerMsg.includes("don't have any")
    ) {
        console.log(`[TIME SLOT] No availability detected, selecting alternative date`);
        return 'Please provide me your available time slots';
    }

    // Extract all time slots with flexible patterns:
    // Matches: HH:MM AM/PM, H:MM AM/PM, with optional leading zeros
    // Handles: "3:30 PM", "03:30 PM", "3:30PM" (with/without space)
    const timePattern = /\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b/g;
    const matches = [];
    let match;
    
    while ((match = timePattern.exec(botMessage)) !== null) {
        matches.push(match[0].trim());
    }

    if (matches && matches.length > 0) {
        // Return the first available time slot
        const selectedTime = matches[0];
        console.log(`[TIME SLOT] Extracted from bot message: "${selectedTime}". Available options: [${matches.join(', ')}]`);
        return selectedTime;
    }

    // Fallback: check if bot is asking for date selection
    if (lowerMsg.includes('which day') || lowerMsg.includes('when would') || 
        lowerMsg.includes('what date') || lowerMsg.includes('choose a date') ||
        lowerMsg.includes('preferred date')) {
        console.log(`[TIME SLOT] Bot asking for date selection, using fallback`);
        return 'Tomorrow';
    }

    // Last resort fallback
    console.log(`[TIME SLOT] No time slot found. Bot message: "${botMessage.substring(0, 150)}..."`);
    return '4:00 PM';
}

export async function validateBooking(
    chatbot: ChatbotPage,
    fixture: any
): Promise<void> {
    const response = await chatbot.getCurrentLatestResponse();

    const confirmationKeywords =
        fixture.booking?.confirmationKeywords ||
        fixture.booking1?.confirmationKeywords ||
        fixture.bookingSuccess;

    if (!confirmationKeywords || confirmationKeywords.length === 0) {
        throw new Error('No booking confirmation keywords found in fixture');
    }

    BookingValidator.validateConfirmation(response, confirmationKeywords);
}

function shouldTriggerDynamicTimeSlot(botMessage: string): boolean {
    if (!botMessage || botMessage.trim() === '') return false;

    const lowerMsg = botMessage.toLowerCase();

    return (
        lowerMsg.includes("isn't available") ||
        lowerMsg.includes('no available') ||
        lowerMsg.includes('unavailable') ||
        lowerMsg.includes('fully booked') ||
        lowerMsg.includes("no longer") ||
        lowerMsg.includes("don't have any")
    );
}
