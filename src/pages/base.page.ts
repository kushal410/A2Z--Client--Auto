import { Page } from '@playwright/test';
import { ENV } from '../../configs/env/env.helper';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    if (!page) {
      throw new Error('Playwright page was not initialized');
    }
    this.page = page;
  }

  async navigateToDashboard(): Promise<void> {
    if (!ENV.baseUrl) {
      throw new Error('ENV.baseUrl is not defined');
    }

    await this.page.goto(ENV.baseUrl, {
      waitUntil: 'domcontentloaded'
    });
  }

  async navigateToCrm(): Promise<void> {
    if (!ENV.crmConfig.url) {
      throw new Error('ENV.crmConfig.url is not defined');
    }

    await this.page.goto(ENV.crmConfig.url, {
      waitUntil: 'domcontentloaded'
    });
  }

  async waitFor(seconds: number): Promise<void> {
    await this.page.waitForTimeout(seconds * 1000);
  }

}
