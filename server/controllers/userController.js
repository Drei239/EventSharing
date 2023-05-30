const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { genrateAccessToken, decodedAccessToken } = require('../utils/tokenTime');
const userModel = require('../models/userModel');


//1.GET ALL USER INFO
const getAllUser = asyncHandler(async (req, res) => {
    const users = await userModel.find({});
    res.json(users);
});

//2.REGISTER NEW USER

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, birthDay  } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const userExists = await userModel.findOne({ email: lowerCaseEmail });
  if (userExists) {
    return res.status(400).json({ message: 'User account already exists' });
  }
  const newUser = await userModel.create({ name, email: lowerCaseEmail, password, phone, birthDay });
  if (newUser) {
    return res.status(201).json({
      success: true,
      token: genrateAccessToken(newUser),
    });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }
});

//3.USER LOGIN

const authLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const user = await userModel.findOne({ email: lowerCaseEmail });
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.json({
      success: true,
      token: genrateAccessToken(user),
    });
  } else {
    return res.status(401).json({ success: false, message: 'Email or password is incorrect' });
  }
});

//4. GET USER PROFILE

const profileUser = asyncHandler(async (req, res) => {
  const bearerToken = req.get('Authorization');
  const token = bearerToken.split(' ')[1];
  const decoded = decodedAccessToken(token);
  const { email } = decoded.data;
  const user = await userModel.findOne({ email });
  res.status(200).json(user);
});

//5. UPDATE USER

const updateUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  }
  const { name, email, currentPassword, newPassword } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  if (newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
  }
  const updatedUser = await user.save();
  return res.json({
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    isAdmin: updatedUser.isAdmin,
    phone: updateUser.phone,
    token: genrateAccessToken(updatedUser._id),
  });
});


//6. UPDATE USER BY ID

const updateUserById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params._id);
  if (!user) {
    res.status(404).json({ message: `Can't find users` });
  }
  const { name, email, isAdmin } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.isAdmin = isAdmin || user.isAdmin;
  const updatedUser = await user.save();
  res.json({
    name: updatedUser.name,
    email: updatedUser.email,
    password: updatedUser.password,
    avatar: updatedUser.avatar,
    isAdmin: updatedUser.isAdmin,
    phone: updateUser.phone,
  });
});

//7. DELETE USER

const deleted = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'Deletion failed' });
  }
  res.status(200).json({ message: 'Delete successfully' });
});



module.exports = {getUsers, register, authLogin, profileUser, updateUser, updateUserById, deleted};