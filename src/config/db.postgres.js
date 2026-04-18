'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

/**
 * Run on startup — creates the users table if it doesn't exist.
 */
async function initPostgres() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      email       VARCHAR(255) UNIQUE NOT NULL,
      password    VARCHAR(255)        NOT NULL,
      created_at  TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(sql);
  console.log('[PostgreSQL] Users table ready.');
}

module.exports = { pool, initPostgres };
