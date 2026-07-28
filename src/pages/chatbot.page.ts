import { Page, Locator, expect, FrameLocator } from '@playwright/test';
import { BasePage } from './base.page';
import { chatbotLocators } from '../locators/chatbot.locators';
import { resolveLocator } from '../utils/locator.resolver';

export class ChatbotPage extends BasePage {
    private readonly frame: FrameLocator;

    private readonly messageInput: Locator;
    private readonly sendButton: Locator;
    private readonly latestBotMessage: Locator;
    private readonly botMessages: Locator;
    private latestSeenBotText = '';

    constructor(page: Page) {
        super(page);

        // Scope everything to iframe
        this.frame = this.page.frameLocator(chatbotLocators.chatbotIframe.value);

        // Resolve locators INSIDE iframe
        this.messageInput = resolveLocator(this.frame, chatbotLocators.messageInputField);
        this.sendButton = resolveLocator(this.frame, chatbotLocators.sendButton);
        this.latestBotMessage = resolveLocator(this.frame, chatbotLocators.botMessageText);
        this.botMessages = resolveLocator(this.frame, chatbotLocators.botMessages);
    }

    async openChatbot(): Promise<void> {
        const icon = resolveLocator(this.page, chatbotLocators.chatbotIcon);
        await icon.waitFor({ state: 'visible' });
        await icon.click();
    }

    async validateGreetingContains(expectedText: string, timeout = 10000): Promise<void> {
        await expect(this.latestBotMessage).toBeVisible({ timeout });

        const actual = (await this.latestBotMessage.innerText({ timeout })).trim();

        if (!actual.toLowerCase().includes(expectedText.toLowerCase())) {
            throw new Error(`Expected greeting to contain "${expectedText}" (case-insensitive). Received: "${actual}"`);
        }
    }

    async sendMessage(message: string): Promise<void> {
        const input = resolveLocator(this.frame, chatbotLocators.messageInputField);
        const sendBtn = resolveLocator(this.frame, chatbotLocators.sendButton);

        try {
            // Ensure input is visible and clear any existing content
            await input.waitFor({ state: 'visible', timeout: 5000 });
            await input.click({ timeout: 2000 });
            await input.fill('');
            
            // Type the message with controlled delay
            await input.type(message, { delay: 40 });

            // Verify message was entered correctly
            let enteredValue = await input.inputValue();
            if (enteredValue !== message) {
                console.log(`[DEBUG] Input mismatch. Expected: "${message}", Got: "${enteredValue}". Re-entering...`);
                await input.fill('');
                await this.page.waitForTimeout(100);
                await input.type(message, { delay: 40 });
                enteredValue = await input.inputValue();
            }

            // Add small delay to let the input register with the form
            await this.page.waitForTimeout(500);

            // Wait for send button to be enabled
            let buttonReady = false;
            let attemptCount = 0;
            const maxAttempts = 40; // ~8 seconds with 200ms intervals

            while (attemptCount < maxAttempts && !buttonReady) {
                try {
                    const isDisabled = await sendBtn.isDisabled({ timeout: 200 });
                    if (!isDisabled) {
                        buttonReady = true;
                        console.log(`[DEBUG] Send button enabled after ${attemptCount * 200}ms`);
                        break;
                    }
                } catch (e) {
                    // Button not available yet, continue waiting
                }

                attemptCount++;
                await this.page.waitForTimeout(200);
            }

            if (!buttonReady) {
                const buttonState = await sendBtn.evaluate(el => ({
                    disabled: (el as HTMLButtonElement).disabled,
                    className: el.className,
                    display: window.getComputedStyle(el).display
                })).catch(() => 'unable to evaluate');

                throw new Error(
                    `Send button did not become enabled after ${attemptCount * 200}ms. ` +
                    `Message: "${message}". Button state: ${JSON.stringify(buttonState)}`
                );
            }

            // Click the button
            await sendBtn.click({ timeout: 3000 });

            // Verify input was cleared (indicates successful submission)
            await this.page.waitForTimeout(400);
            const finalValue = await input.inputValue().catch(() => '?');
            if (finalValue.trim() !== '') {
                console.log(`[WARNING] Input not cleared after send. Contains: "${finalValue}"`);
            }

            console.log(`[SEND] "${message}" submitted successfully`);

        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : String(e);
            console.log(`[SEND ERROR] Failed to send "${message}": ${errorMsg}`);
            throw e;
        }
    }


    async getLatestResponse(timeout = 15000): Promise<string> {
        // Selector to find li.sent that comes after the last li.replies
        const responseLocator = this.frame.locator(`${chatbotLocators.botMessages.value}`).last();

        const start = Date.now();

        while (Date.now() - start < timeout) {
            try {
                await expect(responseLocator).toBeVisible({ timeout: 1000 });
                const text = (await responseLocator.innerText()).trim();
                if (text && text !== this.latestSeenBotText) {
                    this.latestSeenBotText = text;
                    return text;
                }
            } catch (e) {
                // ignore and retry until overall timeout
            }

            await this.page.waitForTimeout(200);
        }

        throw new Error(`Timed out waiting for new bot response (last seen: "${this.latestSeenBotText}")`);
    }

    async getCurrentLatestResponse(timeout = 10000): Promise<string> {
        const latest = this.botMessages.last();
        await expect(latest).toBeVisible({ timeout });

        const text = (await latest.innerText()).trim();

        if (!text) {
            throw new Error('Latest bot response is empty');
        }

        return text;
    }  

    async getAllResponses(): Promise<string[]> {
        const count = await this.botMessages.count();
        const responses: string[] = [];

        for (let i = 0; i < count; i++) {            
            responses.push(
                (await this.botMessages.nth(i).innerText()).trim()
            );
        }

        return responses;
    }

    async getAllLatestResponses(): Promise<string[]> {
        const count = await this.botMessages.count();
        const responses: string[] = [];

        for (let i = 1; i <= count; i++) {           
            responses.push(
                (await this.botMessages.nth(i).innerText()).trim()
            );
        }

        return responses;
    }

    async waitForBotIdle(stableMs = 500, timeout = 10000): Promise<void> {
        const start = Date.now();
        let lastCount = await this.botMessages.count();
        let stableSince = Date.now();

        while (Date.now() - start < timeout) {
            const current = await this.botMessages.count();
            if (current === lastCount) {
                if (Date.now() - stableSince >= stableMs) return;
            } else {
                lastCount = current;
                stableSince = Date.now();
            }
            await this.page.waitForTimeout(100);
        }

        // Don't throw - just return if timeout reached, bot may still be processing
        console.log(`[DEBUG] Bot idle timeout reached (${timeout}ms) at count ${lastCount}`);
    }

    async getAllUserMessages(): Promise<string[]> {
        try {
            // Count li.replies items - each represents one user message
            const count = await this.frame.locator('#message-module li.replies').count();
            const responses: string[] = [];
            const seenMessages = new Set<string>();

            for (let i = 0; i < count && i < 50; i++) {  // Limit to 50 max to prevent infinite loops
                try {
                    // Get text from the #repliesPara div specifically
                    const text = await this.frame.locator('#message-module li.replies').nth(i).locator('#repliesPara').first().innerText({ timeout: 2000 });
                    if (text && text.trim()) {
                        // Only add if not already seen (avoid duplicates)
                        if (!seenMessages.has(text.trim())) {
                            responses.push(text.trim());
                            seenMessages.add(text.trim());
                        }
                    }
                } catch (e) {
                    // Skip if timeout - element may not have text yet
                }
            }

            return responses;
        } catch (e) {
            console.log(`[DEBUG] Error in getAllUserMessages: ${e instanceof Error ? e.message : String(e)}`);
            return [];
        }
    }

    async getUserMessageCount(): Promise<number> {
        try {
            return await this.frame.locator('#message-module li.replies').count();
        } catch (e) {
            console.log(`[DEBUG] Error getting user message count: ${e instanceof Error ? e.message : String(e)}`);
            return 0;
        }
    }
}