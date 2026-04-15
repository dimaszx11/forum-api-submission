/* istanbul ignore file */
const { Pool } = require('pg');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const config = isTest 
  ? {
      host: process.env.PGHOST_TEST,
      port: process.env.PGPORT_TEST,
      user: process.env.PGUSER_TEST,
      password: String(process.env.PGPASSWORD_TEST || ''),
      database: process.env.PGDATABASE_TEST,
    }
  : {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: String(process.env.PGPASSWORD || ''),
      database: process.env.PGDATABASE,
    };

const pool = new Pool(config);
module.exports = pool;