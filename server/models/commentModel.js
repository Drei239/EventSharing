const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    title: { type: String, required: true },
    comment: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Event" },
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;