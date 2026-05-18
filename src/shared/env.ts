
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const readJwtPublicKey = (): string => {
  const inlineKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');
  if (inlineKey?.trim()) {
    return inlineKey;
  }
  const publicKeyPath = path.join(process.cwd(), 'public.pem');
  if (fs.existsSync(publicKeyPath)) {
    return fs.readFileSync(publicKeyPath, 'utf8');
  }
  return '';
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsedValue = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
};

export const {
  NODE_ENV = 'development',
  ALLOWED_ORIGINS = '*',
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  SUPER_ADMIN_PASSWORD,
  SUPER_ADMIN_USERNAME,
  SUPER_ADMIN_EMAIL,
} = process.env;

export const PORT = parseNumber(process.env.PORT, 3000);
export const DB_PORT = parseNumber(process.env.DB_PORT, 5432);
export const DB_SYNC = parseBoolean(process.env.DB_SYNC, NODE_ENV !== 'production');
export const DB_FORCE_SYNC = parseBoolean(process.env.DB_FORCE_SYNC, false);
export const JWT_PUBLIC_KEY = readJwtPublicKey();

const ROOT_DIR = process.cwd();
export const JWT_PRIVATE_KEY = (() => {
  const privateKeyPath = path.join(ROOT_DIR, 'private.pem');
  if (fs.existsSync(privateKeyPath)) {
    return fs.readFileSync(privateKeyPath, 'utf8');
  }
  throw new Error('private.pem not found in project root');
})();