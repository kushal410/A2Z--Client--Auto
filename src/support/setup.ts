import { setDefaultTimeout } from '@cucumber/cucumber';

/**
 * Global step timeout
 * Must align with cucumber.js timeout
 */
setDefaultTimeout(300 * 1000);
