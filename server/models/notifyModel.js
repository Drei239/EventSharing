const mongoose = require("mongoose");

const notifySchema = mongoose.Schema(
  {
    notifyType: {
      type: String,
      enum: ["new-order", "new-comment"],
    },
    notifyFrom: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    notifyTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: {
      type: String,
    },
    isReadMessage: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Notify", notifySchema);
