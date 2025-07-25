const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Attach Socket.io
const socketIoServer = require("./socket");
socketIoServer(server);

// Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use("/api", require("./api"));

// Serve frontend if built
const frontendPath = path.join(__dirname, "../client/build"); // Adjust this path based on your structure

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Health check
app.get("/ping", (req, res) => res.send("pong"));

// Start server
const PORT = process.env.PORT || 7484;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

