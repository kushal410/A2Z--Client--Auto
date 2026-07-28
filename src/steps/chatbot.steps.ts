import { Given, When, Then } from '@cucumber/cucumber';
import { page } from '../hooks/hooks';
import { ChatbotPage } from '../pages/chatbot.page';
import { fixture } from '../utils/fixture.helper';
import { executeConversationFlow, validateBooking } from '../commons/conversation.executor';
import { ChatbotAssertionEngine } from '../commons/chatbot/assertion.engine';

let chatbot: ChatbotPage;

Given('user opens the chatbot', async () => {
    chatbot = new ChatbotPage(page);
    await chatbot.openChatbot();
});

When('user completes conversation flow', async () => {
    await executeConversationFlow(chatbot, fixture);
});

Then('booking should be confirmed', async () => {
    await validateBooking(chatbot, fixture);
});

Then('bot should respond with fallback', async () => {

    const response = await chatbot.getCurrentLatestResponse();

    if (!fixture.fallback?.enabled) {
        throw new Error('Fallback validation disabled for this client');
    }

    ChatbotAssertionEngine.validateGreeting(
        response,
        fixture.fallback.messages
    );
});
