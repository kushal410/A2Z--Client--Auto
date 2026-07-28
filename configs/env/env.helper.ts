import * as dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';

const ENV_NAME = process.env.ENV || 'dev';
const CLIENT = process.env.CLIENT;
const CLIENT_NAME = process.env.CLIENT_NAME;
const LOCATION = process.env.LOCATION;
const CRM = process.env.CRM || 'keepme';

if (!CLIENT) throw new Error('CLIENT environment variable not specified');

const paths = [
  path.resolve(`configs/env/base.env`),
  path.resolve(`configs/env/${ENV_NAME}.env`),
  path.resolve(`configs/clients/${CLIENT}.env`),
  path.resolve(`configs/crm/${CRM}.env`)
];

// Load in order: base → env → client → CRM
paths.forEach(p => {
  if (!fs.existsSync(p)) {
    console.warn(`Env file not found: ${p}`);
    return;
  }
  dotenv.config({ path: p, override: false });
});

export const ENV = {
  env: ENV_NAME,
  client: CLIENT,
  clientName: CLIENT_NAME!,  
  crm: CRM,
  headless: process.env.HEADLESS === 'true',
  baseUrl: process.env.BASE_URL!,
  email: process.env.EMAIL!,
  password: process.env.PASSWORD!,
  apiKey: process.env.API_KEY!,
  organizationId: process.env.ORGANIZATION_ID!,
  timeout: Number(process.env.TIMEOUT ?? 30000),
  retryAttempts: Number(process.env.RETRY_ATTEMPTS ?? 2),
  
  crmConfig: {
    type: process.env.CRM!,
    url: process.env.CRM_URL!,
    username: process.env.CRM_USERNAME,
    password: process.env.CRM_PASSWORD,
    location: LOCATION!,
    apiKey: process.env.CRM_API_KEY,
    apibaseurl: process.env.API_BASE_URL!,
    leadFname : process.env.LEAD_NAME,
    xclientid: process.env.XCLIENTID,
    xclientsecret: process.env.XCLIENTSECRET,
    cookie: process.env.COOKIE
  }
};
