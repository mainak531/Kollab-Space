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

// Serve frontend only in production
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  const buildPath = path.join(__dirname, "../build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) =>
    res.sendFile(path.join(buildPath, "index.html"))
  );
}

// Test route
app.get("/ping", (req, res) => res.send("pong"));

// Start server
const PORT = process.env.PORT || 7484;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

