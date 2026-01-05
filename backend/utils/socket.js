// socket.js
let io;
const onlineUsers = new Map();

function initSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        "https://sohozpoint.com",
        "https://www.sohozpoint.com",
      ], // production: frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) onlineUsers.delete(key);
      }
    });
  });

  return io;
}

module.exports = { initSocket, getIO: () => io, onlineUsers };
