const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');


const tokenTime = require('../utils/tokenTime');
const userModel = require('../models/userModel');

//1.GET ALL USER INFO
const getAllUser = asyncHandler(async (req, res) => {
    const users = await userModel.find({});
    res.json(users);
});

//2.REGISTER NEW USER

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Tài khoản người dùng đã tồn tại');
    }
    const newUser = await userModel.create({ name, email, password });
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: tokenTime(newUser._id),
      });
    } else {
      res.status(400);
      throw new Error('Dữ liệu nhập không hợp lệ');
    }
  });
`const registerUser = asyncHandler(async (req, res) => {
    const { name, reviews } = req.body
    const newUser = await userModel.create({ name, reviews });
    if (newUser) {
        res.status(200).json({
            _id: newUser._id,
            name: newUser.name,
            reviews: newUser.reviews,
            userRating: newUser.userRating
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data!');
    }
});`

//3.GET USER INFO BY ID

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (user) {
        const sum = user.reviews.reduce((accumulator, object) => {
            return (accumulator + object.rating);
        }, 0);
        userRating = sum / (user.reviews.length);
        user.userRating = userRating;
        res.json(user);
    } else {
        res.status(401);
        throw new Error('User info not found!');
    }
});

//4.REVIEWS

module.exports = {
    getAllUser, registerUser, getUserProfile
}