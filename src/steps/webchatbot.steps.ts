// chatbot.steps.ts
import { expect } from '@playwright/test'
import { Given, When, Then } from '@cucumber/cucumber';
import { page } from '../hooks/hooks';
import { WebChatbotPage } from '../pages/webchatbot.page';
import { expectNonEmptyResponse } from '../utils/assertions';
import { logger } from '../utils/logger';
import { fixture } from '../commons/fixture.helper';
import { validateFallbackResponse } from '../commons/fallback.assertion';

let webchatbot: WebChatbotPage;

Given('user opens the webchatbot', async () => {
  webchatbot = new WebChatbotPage(page);
  await webchatbot.openChatbot();
});

When('user sends message for booking {string}', async (msg: string) => {
  if (!webchatbot) throw new Error('WebChatbot not initialized');
  const bookingDay = fixture.booking?.bookingday;
  const bookingTime = fixture.booking?.bookingtime;  
  logger.info(`Sending message: ${msg} for ${bookingDay} at ${bookingTime}`);
  await webchatbot.sendMessage(`${msg} for ${bookingDay} at ${bookingTime}`);
});

When('user sends message for lead name {string}', async (msg: string) => {
  if (!webchatbot) throw new Error('WebChatbot not initialized');
  const Firstname = fixture.booking?.Firstname;
  const Lastname = fixture.booking?.Lastname;  
  logger.info(`Sending message: ${msg}: ${Firstname} ${Lastname}`);
  await webchatbot.sendMessage(`${msg}: ${Firstname} ${Lastname}`);
});

When('user sends message for email and phone number {string}', async (msg: string) => {
  if (!webchatbot) throw new Error('WebChatbot not initialized');
  const Email = fixture.booking?.email;
  const Phonenum = fixture.booking?.phone;  
  logger.info(`Sending message: ${msg}: ${Email} ${Phonenum}`);
  await webchatbot.sendMessage(`${msg}: ${Email} ${Phonenum}`);
});

When('user sends message {string}', async (msg: string) => {
  if (!webchatbot) throw new Error('WebChatbot not initialized');
  logger.info(`Sending message: ${msg}`);
  await webchatbot.sendMessage(msg);
});

Then('bot should respond', async () => {
  const response = await webchatbot.getResponse();
  logger.info(`Bot response: ${response}`);
  expectNonEmptyResponse(response);
});

Then('verify bot response for booking confirmation', async () => {
  const response = await webchatbot.getResponse();
  logger.info(`Response text: ${response}`);
  const expectedResults: string[] = fixture.bookingSuccess;
  console.log("this should be included in success msg: ",expectedResults);
    const matched = expectedResults.some(exp =>
    response.toLowerCase().includes(exp.toLowerCase())
  );
  expect(matched).toBeTruthy();
});


