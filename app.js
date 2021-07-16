const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const app = express();

const PORT = process.env.PORT || 3001;
const morgan = require("morgan");
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

require("./server/models/user");
require("./server/models/post");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(require("./server/routes/auth"));
app.use(require("./server/routes/post"));
app.use(require("./server/routes/user"));

app.use(morgan());

// tells if application is on heroku
app.use(express.static("client/build"));

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  console.log("CATCHING ALL!");
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost/DevVersionDB";
console.log("MONGOURL", mongoUrl);
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to DevVersionDB");
});
mongoose.connection.on("error", (err) => {
  console.log("error while connecting to DevVersionDB : ", err);
});

io.on("connection", socket => {
  socket.emit("your id", socket.id);
  console.log("New person connected")
  socket.on("send message", body => {
      io.emit("message", body)
  })
})

app.listen(PORT, () => {
  console.log(`Server is running under port ${PORT} ...`);
});
