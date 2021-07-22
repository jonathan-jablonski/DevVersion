const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app)


const PORT = process.env.PORT || 3001;
const morgan = require("morgan");
const io = require('socket.io')(http);

require("./server/models/user");
require("./server/models/post");
require("./server/models/conversations");
require("./server/models/messages");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(require("./server/routes/auth"));
app.use(require("./server/routes/post"));
app.use(require("./server/routes/user"));
app.use(require("./server/routes/messages"));
app.use(require("./server/routes/conversations"));

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

io.on('connection', function(socket) {
  console.log("New person connected")
  socket.on('chat msg', function(msg){
    console.log('message: ' + msg)
  })
})

http.listen(PORT, () => {
  console.log(`Server is running under port ${PORT} ...`);
});
