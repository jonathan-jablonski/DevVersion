const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/DevVersionDB"
);

const userSeed = [
  {
    Name: "Timmy",
    Email: "Timmy@test.com",
    Password: "abc123"
  },
  {
    Name: "Brad",
    Email: "Brad@test.com",
    Password: "abc123"
  },
  {
    Name: "Jessica",
    Email: "Jessica@test.com",
    Password: "abc123"
  },
];

db.User
  .remove({})
  .then(() => db.User.collection.insertMany(userSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

