import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, Browser, Page, BrowserContext } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ENV } from '../../configs/env/env.helper';
import { logger } from '../utils/logger';
import { generate } from 'multiple-cucumber-html-reporter';
import { ApiRequest } from '../api/apiRequest';

const execAsync = promisify(exec);

let browser: Browser;
let context: BrowserContext;
export let page: Page;
export let apiRequest: ApiRequest;

// Flags
const KEEP_BROWSER_OPEN = process.env.KEEP_BROWSER_OPEN === 'true';

// Artifact folders
const CLIENT = process.env.CLIENT || 'report';
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots', CLIENT);
const VIDEO_DIR = path.join(process.cwd(), 'videos', CLIENT);
const LOG_DIR = path.join(process.cwd(), 'logs', CLIENT);
const REPORTS_DIR = path.join(process.cwd(), 'reports');

// -------------------- Helpers --------------------

async function clearFolder(dir: string) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (_) { }
  await fs.mkdir(dir, { recursive: true });
}

async function convertWebmToMp4(webmPath: string, mp4Path: string) {
  try {
    await execAsync(
      `ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -pix_fmt yuv420p "${mp4Path}"`
    );
    await fs.unlink(webmPath);
    logger.info(`Video converted: ${mp4Path}`);
  } catch (err) {
    logger.error(`Video conversion failed: ${(err as Error).message}`);
  }
}

// -------------------- Hooks --------------------

BeforeAll(async () => {
  const client = process.env.CLIENT || 'report';
  const htmlReportDir = path.join(REPORTS_DIR, 'html', client === 'report' ? 'default' : client);
  const jsonReportPath = path.join(REPORTS_DIR, `${client}.json`);

  // Ensure directories exist
  await Promise.all([
    fs.mkdir(REPORTS_DIR, { recursive: true }),
    fs.mkdir(SCREENSHOT_DIR, { recursive: true }),
    fs.mkdir(VIDEO_DIR, { recursive: true }),
    fs.mkdir(LOG_DIR, { recursive: true }),
  ]);

  // Clear specific artifacts for this run
  await Promise.all([
    clearFolder(SCREENSHOT_DIR),
    clearFolder(VIDEO_DIR),
    clearFolder(LOG_DIR),
    // Clear specific HTML report folder for this client
    fs.rm(htmlReportDir, { recursive: true, force: true }).then(() => fs.mkdir(htmlReportDir, { recursive: true })),
  ]);

  logger.info(`Artifacts cleaned for client: ${client}`);
});

Before({ timeout: 30000 }, async () => {
  browser = await chromium.launch({ headless: ENV.headless, args: ['--start-maximized'] });

  context = await browser.newContext({
    viewport: null,
    recordVideo: { dir: VIDEO_DIR, size: { width: 1920, height: 1080 } },
  });

  page = await context.newPage();

  apiRequest = new ApiRequest();
  await apiRequest.init();
});

After({ timeout: 30000 }, async function (scenario) {
  try {
    const timestamp = Date.now();

    if (scenario.result?.status === 'FAILED') {
      const screenshotPath = path.join(
        SCREENSHOT_DIR,
        `screenshot-${timestamp}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });
      logger.error(`Screenshot saved: ${screenshotPath}`);
    }

    // Always close page & context (required for video finalization)
    if (page && !page.isClosed()) await page.close();
    if (context) await context.close();

    // Convert videos
    const files = await fs.readdir(VIDEO_DIR);
    for (const file of files.filter(f => f.endsWith('.webm'))) {
      const webm = path.join(VIDEO_DIR, file);
      const mp4 = path.join(VIDEO_DIR, file.replace('.webm', '.mp4'));
      await convertWebmToMp4(webm, mp4);
    }

    // Close browser ONLY if not debugging
    if (!KEEP_BROWSER_OPEN && browser) {
      await browser.close();
    } else {
      logger.warn('Browser kept open for debugging');
    }

  } catch (err) {
    logger.error(`After hook error: ${(err as Error).message}`);
    if (browser && !KEEP_BROWSER_OPEN) await browser.close();
  }
  await apiRequest?.dispose();
});

// AfterAll(async () => {
//   try {
//     const jsonReportPath = path.join(process.cwd(), 'reports/report.json');
//     const htmlReportDir = path.join(process.cwd(), 'reports/html');

//     await fs.access(jsonReportPath);

//     generate({
//       jsonDir: path.dirname(jsonReportPath),
//       reportPath: htmlReportDir,
//       metadata: {
//         browser: { name: 'chromium', version: 'latest' },
//         device: 'Local / CI',
//         platform: { name: process.platform, version: process.version },
//       },
//       customData: {
//         title: 'Execution Info',
//         data: [
//           { label: 'Project', value: 'Palm Mind Chatbot' },
//           { label: 'Environment', value: ENV.headless ? 'CI' : 'Local' },
//           { label: 'Executed At', value: new Date().toLocaleString() },
//         ],
//       },
//     });

//     logger.info(`HTML report generated → ${htmlReportDir}`);
//     await fs.unlink(jsonReportPath);

//   } catch {
//     logger.warn('No JSON report found, skipping HTML generation');
//   }
// });

AfterAll(async () => {
  // HTML report generation moved to scripts/generate-report.ts 
  // because cucumber-js finishes writing the JSON report AFTER all hooks.
});