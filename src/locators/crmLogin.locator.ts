import { LocatorDefinition } from '../types/locator.types';
import { fixture } from '../commons/fixture.helper';

export type LocatorMap = Record<string, LocatorDefinition>;

const fname = fixture.booking?.Firstname;
const lname = fixture.booking?.Lastname;

export const crmLoginLocators = {
    emailInput: {
        strategy: 'name',
        value: 'email',
    },

    passwordInput: {
        strategy: 'name',
        value: 'password',
    },

    loginButton: {
        strategy: 'text',
        value: 'Log In',
    },

    switchtoSales: {
        strategy: 'xpath',
        value: '//span[contains(text(),"Switch to Sales")]',
    },

    leadsNavItem: {
        strategy: 'xpath',
        value: '//span[contains(text(),"Leads")]',
    },

    search: {
        strategy: 'xpath',
        value: '//input[@placeholder="Search.."]',
    },    

    Lead: {
        strategy: 'xpath',
        value: `//span[contains(text(), "${fname} ${lname}" )]`,
    },

    leadstatus: {
        strategy: 'xpath',
        value: '//h3/span[contains(text(),"Tour")]'
    },

    outcomeStatus: {
        strategy: 'xpath',
        value: '//h3/span[contains(text(),"Scheduled")]'
    },

    bookedtimeslot: {
        strategy: 'xpath',
        value: '//div[@class="fc-title"][contains(text(),"Keepmerakshan")]',
    }

} as const satisfies LocatorMap;
