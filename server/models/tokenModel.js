const mongoose = require("mongoose");
const tokenChema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 86400000 },
});
module.exports = mongoose.model("Token", tokenChema);
