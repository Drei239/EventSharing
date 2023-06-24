const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { string } = require("joi");
const schema = mongoose.Schema;
const Joi = require("joi");
const userSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: Joi.string().min(8) },
  birthDay: { type: Date },
  phone: { type: Number },
  description: { type: String, default: "" },
  avatar: {
    type: Joi.string(),
    default:
      "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
  },
  isAdmin: {
    type: Joi.boolean(),
    required: true,
    default: false,
  },
  gender: {
    type: Joi.string(),
  },
  userRating: [
    {
      star: {
        type: Number,
        default: 0,
      },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: { type: String },
      time: { type: Date, default: Date.now() },
      img: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
});

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;