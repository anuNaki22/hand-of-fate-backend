const gameRepository = require('../repositories/gameRepository');
const GameDTO = require('../dto/gameDto');

async function startGame(player1, player2) {
  const gameId = await gameRepository.createGame(player1, player2);
  return new GameDTO(player1, player2, gameId);
}

async function makeMove(gameId, currentPlayer, choice) {
  const game = activeGames[gameId];
  
  if (game.player1 === currentPlayer) {
    game.player1Choice = choice;
  } else if (game.player2 === currentPlayer) {
    game.player2Choice = choice;
  }

  if (game.player1Choice && game.player2Choice) {
    const winner = determineWinner(game.player1Choice, game.player2Choice);
    await gameRepository.updateGameResult(gameId, winner);
    return winner;
  }

  return null;
}

function determineWinner(player1Choice, player2Choice) {
  if (player1Choice === player2Choice) return 'draw';
  if (
    (player1Choice === 'rock' && player2Choice === 'scissors') ||
    (player1Choice === 'scissors' && player2Choice === 'paper') ||
    (player1Choice === 'paper' && player2Choice === 'rock')
  ) {
    return 'player1';
  }
  return 'player2';
}

module.exports = { startGame, makeMove };
