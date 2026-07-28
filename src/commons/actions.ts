import { Page } from '@playwright/test';

import { resolveLocator } from '../utils/locator.resolver';
import { chatbotLocators } from '../locators/chatbot.locators';
import { page } from '../hooks/hooks';

export async function clickElement(
  page: Page,
  key: keyof typeof chatbotLocators
) {
  const locatorDef = chatbotLocators[key];
  const locator = resolveLocator(page, locatorDef);
  await locator.click();
}
