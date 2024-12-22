const pool = require('../db');

async function addPlayer(username) {
  try {
    await pool.query('INSERT INTO players (username) VALUES ($1) ON CONFLICT (username) DO NOTHING', [username]);
  } catch (err) {
    console.error(err);
  }
}

async function getPlayerByUsername(username) {
  try {
    const res = await pool.query('SELECT * FROM players WHERE username = $1', [username]);
    return res.rows[0];
  } catch (err) {
    console.error(err);
  }
}

module.exports = { addPlayer, getPlayerByUsername };
