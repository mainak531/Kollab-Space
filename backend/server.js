const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIoServer = require("./socket");
socketIoServer(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./api"));

app.use(express.static(path.join(__dirname, "../build")));

app.get("/ping", (req, res) => res.send("pong"));

// Handle all remaining routes with React
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../build", "index.html"))
);

const PORT = process.env.PORT || 7484;
server.listen(PORT, () => {
  console.log("Server started on " + PORT);


});
