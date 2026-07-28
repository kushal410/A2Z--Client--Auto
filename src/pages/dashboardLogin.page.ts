import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { loginLocators } from '../locators/dashboardLogin.locator';
import { resolveLocator } from '../utils/locator.resolver';
import { ENV } from '../../configs/env/env.helper';
import { logger } from '../utils/logger';

import { fixture } from '../utils/fixture.helper';

export class DashboardLoginPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async login(): Promise<void> {
        
        await resolveLocator(this.page, loginLocators.emailInput).fill(ENV.email);
        await resolveLocator(this.page, loginLocators.passwordInput).fill(ENV.password);
        await resolveLocator(this.page, loginLocators.loginButton).click();
    }

    async waitFor(seconds: number): Promise<void> {
        await this.page.waitForTimeout(seconds * 1000);
    }

    async searchClient(): Promise<void> {
        const clientName = ENV.clientName;
        logger.info(`Searching for client: ${clientName}`);
        await resolveLocator(this.page, loginLocators.searchClientInput).fill(clientName);
    }

    async selectClientFromTable(): Promise<void> {
        await resolveLocator(this.page, loginLocators.selectClientFromTable).click();                       
    }

    async selectLocation(): Promise<void> {
        await resolveLocator(this.page, loginLocators.locationbox).click();        
        await resolveLocator(this.page, loginLocators.locationInput).fill(ENV.crmConfig.location);
        await this.page.waitForTimeout(5000);
        await resolveLocator(this.page, loginLocators.selectlocation).click();
    }

    async selectAgentTranning(): Promise<void> {
        //await resolveLocator(this.page, loginLocators.selectAgentTranning).click();
        await resolveLocator(this.page, loginLocators.testAgent).click();        
    }


}