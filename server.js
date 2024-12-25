require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const matchRoutes = require("./routes/match");
const { saveMatch, updateUserPoints } = require("./models/matchModel");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/matches", matchRoutes);

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Pastikan origin sesuai kebutuhan
  },
});

// Waiting room and active games
let waitingRoom = []; // Menyimpan pemain yang sedang menunggu
const activeGames = {}; // Menyimpan pasangan pemain dan status game mereka

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Ketika pemain ingin bermain
  socket.on("joinGame", ({ userId }) => {
    if (!userId) {
      socket.emit("error", { message: "Invalid userId" });
      return;
    }

    console.log(`User ${userId} joined the waiting room`);
    waitingRoom.push({ socketId: socket.id, userId });

    // Jika ada 2 pemain di waiting room, pasangkan mereka
    if (waitingRoom.length >= 2) {
      const [player1, player2] = waitingRoom.splice(0, 2);

      const gameId = `${player1.userId}-${player2.userId}`;
      activeGames[gameId] = {
        players: [player1, player2],
        choices: {},
        scores: { [player1.userId]: 0, [player2.userId]: 0 },
        rounds: 0, // Inisialisasi jumlah ronde
      };

      // Beri tahu pemain bahwa game dimulai
      io.to(player1.socketId).emit("gameStarted", {
        opponentId: player2.userId,
        gameId,
      });
      io.to(player2.socketId).emit("gameStarted", {
        opponentId: player1.userId,
        gameId,
      });

      console.log(
        `Game started between ${player1.userId} and ${player2.userId}`
      );
    } else {
      // Beritahu pemain bahwa mereka sedang menunggu
      socket.emit("waiting", { message: "Waiting for an opponent..." });
    }
  });

  // Ketika pemain memilih
  socket.on("playerChoice", async ({ gameId, choice, userId }) => {
    if (!activeGames[gameId]) {
      socket.emit("error", { message: "Game not found" });
      return;
    }

    const game = activeGames[gameId];
    const player = game.players.find((p) => p.userId === userId);

    if (!player) {
      socket.emit("error", { message: "Player not part of this game" });
      return;
    }

    game.choices[userId] = choice;

    if (Object.keys(game.choices).length === 2) {
      const [player1, player2] = game.players;
      const result = determineResult(
        game.choices[player1.userId],
        game.choices[player2.userId]
      );

      if (result === "player1") {
        game.scores[player1.userId]++;
      } else if (result === "player2") {
        game.scores[player2.userId]++;
      }

      game.rounds++; // Perbarui jumlah ronde setiap kali kedua pemain selesai memilih

      game.players.forEach(({ socketId }) => {
        io.to(socketId).emit("roundResult", {
          winner:
            result === "player1"
              ? player1.userId
              : result === "player2"
              ? player2.userId
              : null,
          scores: game.scores,
          choices: game.choices,
        });
      });

      game.choices = {}; // Reset pilihan pemain

      // Cek apakah game selesai
      if (
        game.scores[player1.userId] === 3 ||
        game.scores[player2.userId] === 3 ||
        game.rounds === 5
      ) {
        const winner =
          game.scores[player1.userId] > game.scores[player2.userId]
            ? player1.userId
            : game.scores[player2.userId] > game.scores[player1.userId]
            ? player2.userId
            : "draw";

        game.players.forEach(({ socketId }) => {
          io.to(socketId).emit("gameOver", { winner });
        });

        // Rekam hasil pertandingan ke database
        try {
          const match = await saveMatch(player1.userId, player2.userId, winner);
          if (winner === "draw") {
            // Kedua pemain mendapatkan 1 poin jika seri
            await updateUserPoints(player1.userId, 1);
            await updateUserPoints(player2.userId, 1);
          } else {
            // Beri poin kepada pemenang
            await updateUserPoints(
              player1.userId,
              winner === player1.userId ? 3 : 0
            );
            await updateUserPoints(
              player2.userId,
              winner === player2.userId ? 3 : 0
            );
          }

          console.log("Match saved:", match);
        } catch (error) {
          console.error("Error saving match:", error);
        }

        delete activeGames[gameId];
      }
    } else {
      const opponent = game.players.find((p) => p.userId !== userId);
      if (opponent) {
        io.to(opponent.socketId).emit("opponentChoice", { choice });
      }
    }
  });

  // Ketika pemain keluar
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Hapus dari waiting room
    waitingRoom = waitingRoom.filter((p) => p.socketId !== socket.id);

    // Hapus dari active games
    for (const [gameId, game] of Object.entries(activeGames)) {
      const player = game.players.find((p) => p.socketId === socket.id);
      if (player) {
        const opponent = game.players.find((p) => p.socketId !== socket.id);
        if (opponent) {
          io.to(opponent.socketId).emit("opponentDisconnected", {
            message: "Your opponent has disconnected.",
          });
        }
        delete activeGames[gameId];
        break;
      }
    }
  });
});

// Fungsi untuk menentukan hasil game
function determineResult(choice1, choice2) {
  if (choice1 === choice2) return "draw";
  if (
    (choice1 === "rock" && choice2 === "scissors") ||
    (choice1 === "scissors" && choice2 === "paper") ||
    (choice1 === "paper" && choice2 === "rock")
  ) {
    return "player1";
  }
  return "player2";
}

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
