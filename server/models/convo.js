const mongoose = require("mongoose");

const convoSchema = new mongoose.Schema(
  {
    peers: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("convo", convoSchema);