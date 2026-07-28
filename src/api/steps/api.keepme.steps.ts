import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { apiRequest } from '../../hooks/hooks';
import { KeepmeService } from '../services/keepme.services';
import { fixture } from '../../commons/fixture.helper';

let leadId: string;
let leadEmail: string;
let accessToken: string;

Given('user logs in to Keepme CRM via API', async () => {
  const auth = new KeepmeService(apiRequest);
  accessToken = await auth.loginAndGetToken();

  expect(accessToken.length).toBeGreaterThan(10);
});

Then('a lead is created in Keepme CRM via API', async () => {
  const leads = new KeepmeService(apiRequest);

  leadEmail = `rakshan.${Date.now()}@keepme.ai`;
  const created = await leads.createLead({
    firstName: 'API',
    lastName: 'Lead',
    email: leadEmail,
    phone: '+9779860664388',
  });

  leadId = created.id;
});

Then('lead should exist in Keepme CRM via API', async () => {
  const leads = new KeepmeService(apiRequest);
  const result = await leads.findLead(accessToken);
  const mem_id = result.mem_id;
  const restul1 = await leads.findTour(accessToken, mem_id);  
  expect(result.lead_status).toContain(fixture.keepme_crm.leadStatus); 
  expect(restul1.tour_status).toContain(fixture.keepme_crm.outcomeStatus) 
});
