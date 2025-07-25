const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") }); //For process.env variables
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIoServer = require("./socket");
socketIoServer(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "../build")));
app.use("/api", require("./api"));

//For testing purpose
app.get("/ping", function (req, res) {
  res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 7484; // change to another port


server.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
