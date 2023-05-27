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

//4. DELETE USER

const deleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (user) {
    res.status(200).send('Xóa thành công');
  } else {
    res.status(404);
    throw new Error('Xóa không thành công');
  }
});

//5. UPDATE USER

const updateUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: tokenTime(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
});



module.exports = {
    getAllUser, registerUser, getUserProfile, updateUser, eleteUser
}