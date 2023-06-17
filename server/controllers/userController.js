const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { userSucc } = require("../validators/responsiveMessages");
const {
  updateUserService,
  getPersonalUser,
} = require("../services/userService");
//1.GET ALL USER INFO
const getAllUser = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.json(users);
});

//2.REGISTER NEW USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, reviews } = req.body;
  const newUser = await userModel.create({ name, reviews });
  if (newUser) {
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      reviews: newUser.reviews,
      userRating: newUser.userRating,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
});

//3.GET USER INFO BY ID
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (user) {
    const sum = user.reviews.reduce((accumulator, object) => {
      return accumulator + object.rating;
    }, 0);
    userRating = sum / user.reviews.length;
    user.userRating = userRating;
    res.json(user);
  } else {
    res.status(401);
    throw new Error("User info not found!");
  }
});
const updateUser = asyncHandler(
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const user = await updateUserService(id, data);
      res
        .status(200)
        .json({ status: 200, data: user, message: userSucc.SUC_1 });
    } catch (err) {
      next(err);
    }
  })
);
const getUserPersonal = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await getPersonalUser(id);
    res.status(200).json({ status: 200, data: user, message: userSucc.SUC_2 });
  } catch (err) {
    next(err);
  }
});
//4.REVIEWS

module.exports = {
  getAllUser,
  registerUser,
  getUserProfile,
  updateUser,
  getUserPersonal,
};
