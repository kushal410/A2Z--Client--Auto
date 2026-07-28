import { LocatorDefinition } from '../types/locator.types';

export type LocatorMap = Record<string, LocatorDefinition>;

export const keepmelogin: LocatorMap = {
  email: {
    strategy: 'name',
    value: 'email',
    options: { index: 0 }
  },

  password: {
    strategy: 'name',
    value: 'password',
    options: { index: 0 }
  },

  
}