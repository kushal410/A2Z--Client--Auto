// chatbot.steps.ts
import { Given, When, Then, } from '@cucumber/cucumber';
import { page } from '../hooks/hooks';
import { logger } from '../utils/logger';

import { ENV } from '../../configs/env/env.helper';
import { DashboardLoginPage } from '../pages/dashboardLogin.page';

let login: DashboardLoginPage;

Given(`user navigates to the keepme application`, async () => {
    // Instantiate after page is ready

    login = new DashboardLoginPage(page);

    logger.info(`Navigating to ${ENV.env} keepme application`);
    await login.navigateToDashboard();
});

When('user logs in to keepme Dashboard with valid credentials', async () => {
    logger.info('Logging in with valid credentials');
    await login.login();
});

Then('user waits for {int} seconds', async (seconds: number) => {
    await login.waitFor(seconds);
});

// Then('user selects client', async () => {
//     await login.selectClient();
// });

Then('user search for client', async () => {
    await login.searchClient();
});

Then('user select client from table', async () => {
    await login.selectClientFromTable();
});

Then('user select location', async () => {
    await login.selectLocation();
});

Then('user clicks on Agent Tranning', async () => {
    await login.selectAgentTranning();
});






