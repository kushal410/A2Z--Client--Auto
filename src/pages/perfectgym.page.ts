import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { perfectgymLocators } from '../locators/perfectgym.locator';
import { resolveLocator } from '../utils/locator.resolver';
import { ENV } from '../../configs/env/env.helper';
import { fixture } from '../commons/fixture.helper';

export class perfectgym extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async login(): Promise<void> {
        if (typeof ENV.crmConfig.username !== 'string') {
            throw new Error('Username is not a string');
        }
        await resolveLocator(this.page, perfectgymLocators.emailInput).fill(ENV.crmConfig.username);
        if (typeof ENV.crmConfig.password !== 'string') {
            throw new Error('Password is not a string');
        }
        await resolveLocator(this.page, perfectgymLocators.passwordInput).fill(ENV.crmConfig.password);
        await resolveLocator(this.page, perfectgymLocators.loginButton).click();
    }

    async waitFor(seconds: number): Promise<void> {
        await this.page.waitForTimeout(seconds * 1000);
    }

    async switchtoCRM(): Promise<void> {        
        await resolveLocator(this.page, perfectgymLocators.switchtoCRM).click();                
    }

    async leadsTab(): Promise<void> {
        await resolveLocator(this.page, perfectgymLocators.leadHeading).click();        
        await resolveLocator(this.page, perfectgymLocators.leadsTab).click();                
    }

    async activeLeadsTab(): Promise<void> {        
        await resolveLocator(this.page, perfectgymLocators.activeLeads).click();                
    }

    async searchForLead(): Promise<void> {        
        await resolveLocator(this.page, perfectgymLocators.search).nth(3).fill(fixture.booking?.email);               
    }

    async selectLead(): Promise<void> {        
        await resolveLocator(this.page, perfectgymLocators.Lead).click();      
    }

    async getStatus(): Promise<string> {
        const statustxt = (await resolveLocator(this.page, perfectgymLocators.leadstatus).nth(0).innerText()).trim();                   
        return statustxt;
    }

    async outcomeStatus(): Promise<string> {
        const outcomestatustxt = (await resolveLocator(this.page, perfectgymLocators.outcomeStatus).innerText()).trim();                   
        return outcomestatustxt;
    }

}