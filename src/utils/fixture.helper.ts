import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment file
dotenv.config({
  path: path.resolve(process.cwd(), 'configs/env/client.env'),
});

const clientName = process.env.CLIENT;

if (!clientName) {
  throw new Error('CLIENT is not defined in client.env');
}

// Build path dynamically
const fixturePath = path.resolve(
  process.cwd(),
  `src/fixtures/${clientName}.json`
);

// Validate file existence
if (!fs.existsSync(fixturePath)) {
  throw new Error(
    `Fixture file not found for client: ${clientName}
Expected path: ${fixturePath}`
  );
}

// Load JSON
export const fixture = (() => {
  const data = JSON.parse(
    fs.readFileSync(fixturePath, 'utf-8')
  );
  console.log(`Loaded fixture for client: ${clientName}`);
  return data;
})();

