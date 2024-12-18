// koneksi ke  database postgreSQL


// const Pool = require('pg').Pool
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'walled-api-d6',
//     password: 'Gn.02112002',
//     // port: 5432
//     DATABASE_URL: 'postgres://neondb_owner:k0WwnDOf9VhI@ep-purple-mode-a1x6vyrk-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
// })

// module.exports = pool;

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;