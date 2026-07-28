// chatbot.steps.ts
import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { page } from '../hooks/hooks';
import { logger } from '../utils/logger';
import { ENV } from '../../configs/env/env.helper';
import { perfectgym } from '../pages/perfectgym.page';
import { fixture } from '../commons/fixture.helper';

let perfectgymPage: perfectgym;

Given(`user navigates to the perfectgym CRM application`, async () => {
    // Instantiate after page is ready

    perfectgymPage = new perfectgym(page);

    logger.info(`Navigating to ${ENV.crm} CRM application`);
    await perfectgymPage.navigateToCrm();
});

When('user logs in to perfectgym CRM with valid credentials', async () => {
    logger.info('Logging in with valid credentials');
    await perfectgymPage.login();
});

Then('user waits for {int} seconds PG', async (seconds: number) => {
    await perfectgymPage.waitFor(seconds);
});

Then('user switch to CRM in perfectgym', async () => {
    logger.info('switch to CRM');
    await perfectgymPage.switchtoCRM();
});

Then('user click on Leads tab in perfectgym', async () => {
    logger.info('clicks on Lead tab');
    await perfectgymPage.leadsTab();
});

Then('user clicks on active Lead tab in perfectgym', async () => {
    logger.info('clicks on active Lead tab');
    await perfectgymPage.activeLeadsTab();
});

Then('user search for new created Lead in perfectgym', async () => {
    logger.info('click on new created lead');
    await perfectgymPage.searchForLead();
});

Then('verify lead status in perfectgym', async () => {
  const leadstatus = await perfectgymPage.getStatus();
  logger.info(`Lead status text: ${leadstatus}`);
  const leadexpectedResults = fixture.perfectGym_crm.leadStatus;
  console.log('Expected Tour status', leadexpectedResults);
  expect(leadstatus).toContain(leadexpectedResults);
});

Then('verify outcome status in perfectgym', async () => {
  const outcomestatus = await perfectgymPage.outcomeStatus();
  logger.info(`Lead outcome status text: ${outcomestatus}`);
  const outcomeexpectedResults = fixture.keepme_crm.outcomeStatus;
  console.log('Expected lead outcome status', outcomeexpectedResults);
  expect(outcomestatus).toContain(outcomeexpectedResults);
});