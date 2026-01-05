// socket.js
let io;
const onlineUsers = new Map();
const jwt = require("jsonwebtoken");

function initSocket(server) {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        "https://sohozpoint.com",
        "https://www.sohozpoint.com",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 🔐 AUTH MIDDLEWARE
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // 🔥 trusted userId
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    // ✅ auto register (no client input)
    onlineUsers.set(socket.userId.toString(), socket.id);

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId.toString());
    });
  });

  return io;
}

module.exports = {
  initSocket,
  getIO: () => io,
  onlineUsers,
};
