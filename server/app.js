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

require("./models/user");
require("./models/post");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// tells if application is on heroku

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(PORT, () => {
  console.log(`Server is running under port ${PORT} ...`);
});
