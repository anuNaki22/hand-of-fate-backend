const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rock_paper_scissors',
  password: 'Gn.02112002',
  port: 5432,
});

module.exports = pool;
