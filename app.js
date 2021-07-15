const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const URL = "mongodb://localhost/DevVersionDB";

mongoose.connect(process.env.MONGODB_URI || URL, {
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

require("./server/models/user");
require("./server/models/post");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(require("./server/routes/auth"));
app.use(require("./server/routes/post"));
app.use(require("./server/routes/user"));

// tells if application is on heroku

app.use(express.static("client/build"));

app.listen(PORT, () => {
  console.log(`Server is running under port ${PORT} ...`);
});
