import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { apiRequest } from '../../hooks/hooks';
import { perfectgymService } from '../services/perfectgym.services';
import { fixture } from '../../commons/fixture.helper';

let setCookie: string;

Given('user logs in to Perfectgym CRM via API', async () => {
  const auth = new perfectgymService(apiRequest);
  setCookie = await auth.loginAndGetCookie();

  expect(setCookie.length).toBeGreaterThan(10);
});

Then('lead should exist in Perfectgym CRM via API', async () => {
  const leads = new perfectgymService(apiRequest);
  const result = await leads.findLead(setCookie);
  expect(result.lead_status).toContain(fixture.perfectGym_crm.leadStatus);   
});
