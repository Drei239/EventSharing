const mongoose = require("mongoose");

const replySchema = mongoose.Schema({
  title: { type: String, required: true },
  comment: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = mongoose.Schema({
  title: { type: String, required: true },
  comment: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Event" },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  reply: [replySchema],
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
