import { Browser, BrowserContext, Page } from '@playwright/test';
import { setWorldConstructor } from '@cucumber/cucumber';

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
}

setWorldConstructor(CustomWorld);
