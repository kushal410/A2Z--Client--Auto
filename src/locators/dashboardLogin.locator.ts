import { LocatorDefinition } from '../types/locator.types';
import { ENV } from '../../configs/env/env.helper';

export type LocatorMap = Record<string, LocatorDefinition>;

export const loginLocators = {
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
        value: 'Sign In',
    },

    searchClientInput: {
        strategy: 'placeholder',
        value: 'Search clients...',
    },

    selectClientFromTable: {
        strategy: 'htmlElement',
        value: `tr:has-text("${ENV.clientName}")`,
    },

    testAgent: {
        strategy: 'xpath',
        value: '//button[@id="iframe-button"]',
    },

    locationbox: {
        strategy: 'xpath',
        value: '//div[@id="venue-bot-location-filter-ts-control"]',
    },
    
    locationInput: {
        strategy: 'xpath',
        value: '//input[@class="dropdown-input"]',
    },

    selectlocation: {
        strategy: 'xpath',
        value: '//div[@role="option"]',
    }

} as const satisfies LocatorMap;
