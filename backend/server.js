const dotenv = require("dotenv");
const http = require("http");
dotenv.config(); // Load env variables first

const app = require("./app");
const { initSocket } = require("./utils/socket");
require("./config/db"); // DB connection
const server = http.createServer(app);
const io = initSocket(server);
// 4️⃣ Routes test
app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

// 5️⃣ Server listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 6️⃣ Handle Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception! Server shutting down...");
  console.error(err);
  process.exit(1);
});

// 7️⃣ Handle Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection! Server shutting down...");
  console.error(err);
  server.close(() => process.exit(1));
});
