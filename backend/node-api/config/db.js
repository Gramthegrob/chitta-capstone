// node-api/config/db.js
require('dotenv').config();
const { Pool } = require('pg');

function must(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`ENV ${name} is missing`);
  }
  return v;
}

const pool = new Pool({
  host: must('DB_HOST'),
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: must('DB_USER'),
  password: must('DB_PASSWORD'),   // <- harus string & tidak kosong
  database: must('DB_NAME'),
  ssl: false, // set true bila butuh
});

pool.on('error', (err) => {
  console.error('PG Pool error:', err);
});

module.exports = { pool, query: (text, params) => pool.query(text, params) };
