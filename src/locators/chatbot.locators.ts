import { LocatorDefinition } from '../types/locator.types';

export type LocatorMap = Record<string, LocatorDefinition>;

export const chatbotLocators = {

  /* Chatbo Entry Icon */
  chatbotIcon: {
    strategy: 'css',
    value: '#iframe-button',
  },

  chatbotIframe: {
    strategy: 'css',
    value: 'iframe[title="Agent Test Iframe"]',
  },

  /* Message Module */
  messageModule: {
    strategy: 'css',
    value: '#message-module',
  },

  messageList: {
    strategy: 'css',
    value: '#message-module .message-section',
  },

  /* Messages - Swapped based on observed DOM behavior:
     li.sent = Bot Responses
     li.replies = User Inputs
  */
  allMessages: {
    strategy: 'css',
    value: '#message-module li.sent, #message-module li.replies',
  },

  botMessages: {
    strategy: 'css',
    value: '#message-module li.sent #utterPara',
  },

  userMessages: {
    strategy: 'css',
    value: '#message-module li.replies #repliesPara',
  },

  latestBotMessage: {
    strategy: 'css',
    value: '#message-module li.sent:last-of-type #utterPara',
  },

  latestUserMessage: {
    strategy: 'css',
    value: '#message-module li.replies:last-of-type #repliesPara',
  },

  botMessageText: {
    strategy: 'css',
    value: '#message-module li.sent:last-of-type #utterPara',
  },

  userMessageText: {
    strategy: 'css',
    value: '#message-module li.replies:last-of-type #repliesPara',
  },

  /* Message Input */
  messageInputField: {
    strategy: 'css',
    value: 'textarea#search1',
  },

  sendButton: {
    strategy: 'css',
    value: 'button.submit',
  },

  /* Autosuggest */
  autoSuggestList: {
    strategy: 'css',
    value: '#autosuggest',
  },

  autoSuggestOptions: {
    strategy: 'css',
    value: '#autosuggest .list-group-item',
  },

} as const satisfies LocatorMap;
