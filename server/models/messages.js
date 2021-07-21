const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "User"
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: Date.now,
    },
  }
);

// MessageSchema.methods.saveMessageConvo = (msg, convoId, cb ) => {
      
// }

module.exports = mongoose.model("Messages", MessageSchema);
