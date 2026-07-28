import { LocatorDefinition } from '../types/locator.types';

export type LocatorMap = Record<string, LocatorDefinition>;

export const webchatbotLocators = {
  chatbotIcon: {
    strategy: 'xpath',
    value: '//button[@id="iframe-button"]',    
  },

  chatbotIframe: {
    strategy: 'title',
    value: 'iframe[src*="chatbotstaging.keepme.ai"]',
  },

  messageInput: {
    strategy: 'xpath',
    value: '//div[@id="message-input-module"]/div/div/textarea',
  },

  sendButton: {
    strategy: 'xpath',
    value: '//button[@class="submit"]',
  },

  botResponse: {
    strategy: 'xpath',
    value: '//div[@id="utterPara"]',
  },

} as const satisfies LocatorMap;
