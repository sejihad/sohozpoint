const dotenv = require("dotenv");

dotenv.config(); // ✅ Ensure environment variables are loaded first

const app = require("./app");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception! Server shutting down...");
  console.error(err);
  process.exit(1);
});

// Database Connection
require("./config/db");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API IS WORKING");
});
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection! Server shutting down...");
  console.error(err);
  server.close(() => process.exit(1));
});
