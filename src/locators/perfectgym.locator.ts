import { ENV } from '../../configs/env/env.helper';
import { LocatorDefinition } from '../types/locator.types';
import { fixture } from '../commons/fixture.helper';

export type LocatorMap = Record<string, LocatorDefinition>;

const fname = fixture.booking?.Firstname;
const lname = fixture.booking?.Lastname;

export const perfectgymLocators = {
    emailInput: {
        strategy: 'xpath',
        value: '//input[@name="Login"]',
    },

    passwordInput: {
        strategy: 'name',
        value: 'Password',
    },

    loginButton: {
        strategy: 'css',
        value: 'baf\\:button.action.is-center.baf-button',
    },

    switchtoCRM: {
        strategy: 'xpath',
        value: '//a[@baf-state="CRM2"]',
    },

    leadHeading: {
        strategy: 'xpath',
        value: '//h3[contains(text(),"Leads")]'
    },

    leadsTab: {
        strategy: 'xpath',
        value: '//a[@baf-state="CRM2.Dashboard.Leads"]',
    },

    activeLeads: {
        strategy: 'xpath',
        value: '//span[contains(text(),"Active Leads")]',
    },

    search: {
        strategy: 'xpath',
        value: '//input[@type="text"]',
    },    

    Lead: {
        strategy: 'xpath',
        value: `//span[contains(text(), "${fname} ${lname}" )]`,
    },

    leadstatus: {
        strategy: 'xpath',
        value: '//td/div/span'
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
