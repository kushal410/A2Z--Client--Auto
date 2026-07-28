import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logFile = path.join(LOG_DIR, `run-${Date.now()}.log`);

function write(level: string, message: string) {
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(logFile, line, 'utf-8');
  console.log(line.trim());
}

export const logger = {
  info: (msg: string) => write('info', msg),
  warn: (msg: string) => write('warn', msg),
  error: (msg: string) => write('error', msg),
};
