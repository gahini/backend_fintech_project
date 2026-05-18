// src/config/dbConfig.ts

import { Sequelize } from 'sequelize';
import {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  NODE_ENV,
} from '../shared/env';
import pg from 'pg';

const isProduction =
  NODE_ENV === 'production' || process.env.NODE_ENV === 'production';

// For local development, many Postgres servers don't support SSL.
// Set dialectOptions.ssl to `false` for non-production to avoid attempting SSL handshake.
const dialectOptions = isProduction
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {
      ssl: false,
    };

const sequelize = new Sequelize(
  DB_NAME ?? '',
  DB_USER ?? '',
  DB_PASSWORD ?? '',
  {
    host: DB_HOST ?? 'localhost',
    dialect: 'postgres',
    port: DB_PORT,
    logging: false,
    dialectModule: pg,
    dialectOptions,
  }
);

export default sequelize;