import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { crmLoginLocators } from '../locators/crmLogin.locator';
import { resolveLocator } from '../utils/locator.resolver';
import { ENV } from '../../configs/env/env.helper';
import { fixture } from '../commons/fixture.helper';


export class CrmLoginPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async login(): Promise<void> {
        if (typeof ENV.crmConfig.username !== 'string') {
            throw new Error('Username is not a string');
        }
        await resolveLocator(this.page, crmLoginLocators.emailInput).fill(ENV.crmConfig.username);
        if (typeof ENV.crmConfig.password !== 'string') {
            throw new Error('Password is not a string');
        }
        await resolveLocator(this.page, crmLoginLocators.passwordInput).fill(ENV.crmConfig.password);
        await resolveLocator(this.page, crmLoginLocators.loginButton).click();
    }

    async waitFor(seconds: number): Promise<void> {
        await this.page.waitForTimeout(seconds * 1000);
    }

    async switchtoSales(): Promise<void> {        
        await resolveLocator(this.page, crmLoginLocators.switchtoSales).click();                
    }

    async leadsNavItem(): Promise<void> {        
        await resolveLocator(this.page, crmLoginLocators.leadsNavItem).click();                
    }

    async searchForLead(): Promise<void> {     
        const Firstname = fixture.booking?.Firstname;   
        await resolveLocator(this.page, crmLoginLocators.search).fill(Firstname);                
    }

    async selectLead(): Promise<void> {       
        await resolveLocator(this.page, crmLoginLocators.Lead).click();            
    }

    async getStatus(): Promise<string> {
        const statustxt = (await resolveLocator(this.page, crmLoginLocators.leadstatus).innerText()).trim();                
        return statustxt;
    }

    async outcomeStatus(): Promise<string> {
        const outcomestatustxt = (await resolveLocator(this.page, crmLoginLocators.outcomeStatus).innerText()).trim();             
        return outcomestatustxt;
    }

}