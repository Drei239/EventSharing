const mongoose = require("mongoose");

const notifySchema = mongoose.Schema({
  notifyType: {
    type: String,
    enum: ["new-order", "new-comment", "upcoming-event"],
  },
  notifyFrom: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: Boolean,
    default: false,
  },
  isNew: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: new Date(), expires: 60 * 60 * 24 * 60 },
});
module.exports = mongoose.model("Notify", notifySchema);
