// koneksi ke  database postgreSQL


const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'walled-api-d6',
    password: 'Gn.02112002',
    port: 5432
})

module.exports = pool;

