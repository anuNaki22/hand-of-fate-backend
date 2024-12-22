const pool = require('../db');

async function createGame(player1, player2) {
  try {
    const res = await pool.query(
      'INSERT INTO games (player1_id, player2_id) VALUES ((SELECT id FROM players WHERE username = $1), (SELECT id FROM players WHERE username = $2)) RETURNING id',
      [player1, player2]
    );
    return res.rows[0].id;
  } catch (err) {
    console.error(err);
  }
}

async function updateGameResult(gameId, winner) {
  try {
    await pool.query(
      'UPDATE games SET winner = $1 WHERE id = $2',
      [winner, gameId]
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = { createGame, updateGameResult };
