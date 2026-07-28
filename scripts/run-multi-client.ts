import { exec } from 'child_process';
import { clients } from '../configs/clients';

// CLI flags
const ENV = process.env.ENV || 'dev';
const HEADLESS = process.env.HEADLESS !== 'false';
const TAGS = process.env.TAGS || '@regression';

// clients array example
// clients = [
//   { name: 'keepme', crms: ['zoho', 'keepme'] },
const fs = require('fs');
const path = require('path');

const runTests = async () => {
  const REPORTS_DIR = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const clientPromises: Promise<void>[] = [];

  for (const clientObj of clients) {
    const clientName = clientObj.name;

    for (const crm of clientObj.crms) {
      const promise = new Promise<void>((resolve) => {
        const cmd = `cross-env ENV=${ENV} CLIENT=${clientName} CRM=${crm} HEADLESS=${HEADLESS} cucumber-js --tags ${TAGS}`;
        const reportCmd = `cross-env CLIENT=${clientName} npm run posttest`;

        console.log(`\n🔹 Starting ${TAGS} for ${clientName}/${crm} (${HEADLESS ? 'headless' : 'headed'})\n`);

        const child = exec(`${cmd}; ${reportCmd}`);

        child.stdout?.pipe(process.stdout);
        child.stderr?.pipe(process.stderr);

        child.on('exit', code => {
          console.log(`\n  ${clientName}/${crm} finished with exit code ${code}\n`);
          resolve();
        });
      });
      clientPromises.push(promise);
    }
  }

  await Promise.all(clientPromises);
  console.log('\n All multi-client tests completed.\n');
};

runTests().catch(err => {
  console.error('Multi-client execution failed:', err);
  process.exit(1);
});
