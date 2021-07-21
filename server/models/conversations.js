const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema(
  {
    userOne:
    {
      type: ObjectId,
      ref: "User",
      required: true
    },
    userTwo:
    {
      type: ObjectId,
      ref: "User",
      required: true
    },
    messages: [{
      type: ObjectId,
      ref: "Messages"
    }],
  });

module.exports = mongoose.model("Conversations", conversationSchema);
