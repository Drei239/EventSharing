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

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthDay: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },

    reviews: [reviewSchema],

    userRating: {
        type: Number,
        required: true,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;