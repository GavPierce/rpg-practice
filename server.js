const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the client-side files
app.use(express.static(__dirname + "/app"));

let players = [];
// Socket.IO logic
io.on("connection", (socket) => {
  const playerId = socket.id;
  socket.emit("initialize", { playerId, players });

  players.push(playerId);
  console.log(`Player connected: ${players}`);

  socket.broadcast.emit("playerConnected", playerId);
  // Handle player movement messages
  socket.on("move", (direction) => {
    // Broadcast the movement message to all connected clients except the sender
    socket.broadcast.emit("move", { playerId, direction });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    players = players.filter(function (player) {
      return player != playerId;
    });
    console.log(`Player disconnected: ${players}`);
    socket.broadcast.emit("playerDisconnected", playerId);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
