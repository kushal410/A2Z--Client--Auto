import { generate } from 'multiple-cucumber-html-reporter';
import path from 'path';
import fs from 'fs';
import open from "open";

const client = process.env.CLIENT || 'report';
const jsonReportPath = path.join(process.cwd(), 'reports', `${client}.json`);
const htmlReportDir = path.join(process.cwd(), 'reports', 'html', client === 'report' ? 'default' : client);

if (!fs.existsSync(jsonReportPath)) {
    const files = fs.readdirSync(path.join(process.cwd(), 'reports'));
    console.warn(`No JSON report found at ${jsonReportPath}. Files in reports/: ${files.join(', ')}`);
    process.exit(0);
}

console.log(`Generating HTML report for client: ${client}...`);

generate({
    jsonDir: path.join(process.cwd(), 'reports'),
    reportPath: htmlReportDir,
    metadata: {
        browser: { name: 'chromium', version: 'latest' },
        device: 'Local / CI',
        platform: { name: process.platform, version: process.version },
    },
    customData: {
        title: 'Execution Info',
        data: [
            { label: 'Project', value: 'Palm Mind Chatbot' },
            { label: 'Client', value: client },
            { label: 'Environment', value: process.env.ENV || 'local' },
            { label: 'Executed At', value: new Date().toLocaleString() },
        ],
    },
});

async function openReport() {
    console.log(`HTML report generated at: ${htmlReportDir}`);
    const reportUrl = `${htmlReportDir}//index.html`;
    console.log("Final report url:", reportUrl);
    await open(reportUrl);
}

openReport();