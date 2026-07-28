// chatbot.steps.ts
import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { page } from '../hooks/hooks';
import { logger } from '../utils/logger';
import { ENV } from '../../configs/env/env.helper';
import { CrmLoginPage } from '../pages/crmLogin.page';
import { fixture } from '../commons/fixture.helper';

let crmLoginPage: CrmLoginPage;

Given(`user navigates to the CRM application`, async () => {
    // Instantiate after page is ready

    crmLoginPage = new CrmLoginPage(page);

    logger.info(`Navigating to ${ENV.crm} CRM application`);
    await crmLoginPage.navigateToCrm();
});

When('user logs in to CRM with valid credentials', async () => {
    logger.info('Logging in with valid credentials');
    await crmLoginPage.login();
});

Then('user waits for {int} seconds keepme', async (seconds: number) => {
    await crmLoginPage.waitFor(seconds);
});

Then('user clicks on switchToSales', async () => {
    logger.info('Switched to Sales');
    await crmLoginPage.switchtoSales();
});

Then('user clicks on Leads', async () => {
    logger.info('Click on leads left side bar Item');
    await crmLoginPage.leadsNavItem();
});

Then('user search for lead name', async () => {
    logger.info('Search for lead name');
    await crmLoginPage.searchForLead();
});

Then('user clicks on new created Lead', async () => {
    logger.info('click on new created lead');
    await crmLoginPage.selectLead();
});

Then('verify lead status', async () => {
  const leadstatus = await crmLoginPage.getStatus();
  logger.info(`Lead status text: ${leadstatus}`);
  const leadexpectedResults = fixture.keepme_crm.leadStatus;
  console.log('Expected Tour status', leadexpectedResults);
  expect(leadstatus).toContain(leadexpectedResults);
});

Then('verify outcome status', async () => {
  const outcomestatus = await crmLoginPage.outcomeStatus();
  logger.info(`Lead outcome status text: ${outcomestatus}`);
  const outcomeexpectedResults = fixture.keepme_crm.outcomeStatus;
  console.log('Expected lead outcome status', outcomeexpectedResults);
  expect(outcomestatus).toContain(outcomeexpectedResults);
});