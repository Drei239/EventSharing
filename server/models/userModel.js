const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const reviewSchema = mongoose.Schema({
      title: { type: String, required: true },
      image: { type: String, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
      name: { type: String, required: true },
});
const userSchema = new schema(
    {
      name: { type: String, min: 6, max: 24, required: true },
      email: { type: String, min: 6, max: 50, required: true },
      password: { type: String, required: true },
      birthDay: { type: Date, required: true },
      description: { type: String, required: true },
      avatar: { type: String, required: true },
      phone: { type: String, required: true },

      isAdmin: {
        type: Boolean,
        required: true,
        default: false,},
      userRating: {
        type: Number,
        required: true,
        default: 0},
    },
    {
      timestamps: true,
    },
    reviews = [reviewSchema],

  );

  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  

const User = mongoose.model('User', userSchema);
module.exports = User;