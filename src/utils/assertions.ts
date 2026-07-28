import { expect } from '@playwright/test';

export const expectNonEmptyResponse = (text: string) => {
  expect(text.trim().length).toBeGreaterThan(0);
};
