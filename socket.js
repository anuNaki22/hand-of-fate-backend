const rooms = {}; // Penyimpanan data permainan di tiap room

const socketHandler = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", ({ roomId, userId }) => {
      if (!rooms[roomId])
        rooms[roomId] = { players: [], rounds: [], scores: {} };

      const room = rooms[roomId];
      if (room.players.length >= 2) {
        return socket.emit("error", { message: "Room is full" });
      }

      room.players.push({ socketId: socket.id, userId });
      room.scores[userId] = 0;

      socket.join(roomId);
      io.to(roomId).emit("playerJoined", { players: room.players });

      if (room.players.length === 2) {
        io.to(roomId).emit("startGame", { message: "Game started!" });
      }
    });

    socket.on("playTurn", ({ roomId, userId, choice }) => {
      const room = rooms[roomId];
      if (!room) return socket.emit("error", { message: "Room not found" });

      room.rounds.push({ userId, choice });
      if (room.rounds.length === 2) {
        const [player1, player2] = room.rounds;
        const result = determineWinner(player1.choice, player2.choice);

        if (result.winner === player1.userId) {
          room.scores[player1.userId]++;
        } else if (result.winner === player2.userId) {
          room.scores[player2.userId]++;
        }

        io.to(roomId).emit("roundResult", {
          rounds: room.rounds,
          scores: room.scores,
          winner: result.winner,
        });

        if (
          room.scores[player1.userId] === 3 ||
          room.scores[player2.userId] === 3
        ) {
          const finalWinner =
            room.scores[player1.userId] > room.scores[player2.userId]
              ? player1.userId
              : player2.userId;

          io.to(roomId).emit("gameOver", {
            finalWinner,
            scores: room.scores,
          });

          room.players.forEach((player) =>
            updateUserPoints(
              player.userId,
              finalWinner === player.userId ? 3 : 0
            )
          );
          delete rooms[roomId];
        } else {
          room.rounds = [];
        }
      }
    });
  });
};

const determineWinner = (choice1, choice2) => {
  const winCondition = { rock: "scissors", scissors: "paper", paper: "rock" };
  if (choice1 === choice2) return { winner: "draw" };
  return winCondition[choice1] === choice2
    ? { winner: "player1" }
    : { winner: "player2" };
};

module.exports = socketHandler;
