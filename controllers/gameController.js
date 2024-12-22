const gameService = require('../services/gameService');

async function startGame(req, res) {
  const { player1, player2 } = req.body;
  const game = await gameService.startGame(player1, player2);
  res.json(game);
}

async function makeMove(req, res) {
  const { gameId, currentPlayer, choice } = req.body;
  const result = await gameService.makeMove(gameId, currentPlayer, choice);
  if (result) {
    res.json({ winner: result });
  } else {
    res.status(400).json({ message: 'Game still in progress' });
  }
}

module.exports = { startGame, makeMove };
