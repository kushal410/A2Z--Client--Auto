import { expect } from '@playwright/test';
import { logger } from '../utils/logger';

export function validateFallbackResponse(
  actualResponse: string,
  expectedFallbacks: string[]
) {
  logger.warn(`Fallback triggered. Response: ${actualResponse}`);

  const matched = expectedFallbacks.some(fallback =>
    actualResponse.toLowerCase().includes(fallback.toLowerCase())
  );

  expect(
    matched,
    `Response did not match any fallback message.\nActual: ${actualResponse}`
  ).toBeTruthy();
}
