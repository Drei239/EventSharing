const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const replySchema = mongoose.Schema({
  title: { type: String, required: true },
  comment: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  likeList: [likeSchema],
  likeCount: { type: Number, default: 0 }
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
  likeList: [likeSchema],
  likeCount: { type: Number, default: 0 }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
