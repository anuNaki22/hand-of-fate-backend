const express = require('express');
const WebSocket = require('ws');
const playerRouter = require('./routers/playerRouter');
const gameRouter = require('./routers/gameRouter');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/players', playerRouter);
app.use('/games', gameRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// WebSocket server for multiplayer interaction
const wss = new WebSocket.Server({ server });

let activeGames = {};

wss.on('connection', (ws) => {
  let currentPlayer = null;

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      currentPlayer = data.username;
      ws.send(JSON.stringify({ type: 'joined', username: currentPlayer }));
    } else if (data.type === 'start_game') {
      const opponent = data.opponent;
      const gameId = await gameService.startGame(currentPlayer, opponent);
      activeGames[gameId] = { player1: currentPlayer, player2: opponent };
      ws.send(JSON.stringify({ type: 'game_started', gameId }));
    } else if (data.type === 'make_move') {
      const { gameId, choice } = data;
      const result = await gameService.makeMove(gameId, currentPlayer, choice);
      if (result) {
        ws.send(JSON.stringify({ type: 'game_result', winner: result }));
      }
    }
  });
});