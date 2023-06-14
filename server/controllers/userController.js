const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  generateToken,
  generateAccessToken,
  decodedAccessToken,
} = require('../utils/tokenTime');
const { refreshToken } = require('../controllers/refreshTokenController');
const userModel = require('../models/userModel');
const e = require('express');

//1.GET ALL USER INFO
const getAllUser = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.json(users);
});

//2.REGISTER NEW USER
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const userExists = await userModel.findOne({ email: lowerCaseEmail });
  if (userExists) {
    return res.status(400).json({ message: 'Email đã có tài khoản' });
  }

  let newUser;
  if (password) {
    newUser = await userModel.create({
      name,
      email: lowerCaseEmail,
      password,
    });
  } else {
    newUser = await userModel.create({
      name,
      email: lowerCaseEmail,
    });
  }

  if (newUser) {
    // const { accessToken, refreshToken } = await generateToken(newUser);
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   sameSite: true,
    // });
    // return res.status(201).json({
    //   success: true,
    //   accessToken,
    //   refreshToken,
    //   message: 'Tạo tài khoản thành công',
    // });
    res.status(201).json({
      success: true,
      data: 'Tạo tài khoản thành công',
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: 'Tạo tài khoản thất bại' });
  }
});

//3.USER LOGIN
const authLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: lowerCaseEmail });
    if (user && (await bcrypt.compare(password, user.password))) {
      // const { accessToken, refreshToken } = await generateToken(user);

      // res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   sameSite: true,
      // });
      // return res.status(201).json({
      //   success: true,
      //   accessToken,
      //   refreshToken,
      //   message: 'Logged in sucessfully',
      // });
      const token = jwt.sign({ _id: user._id }, process.env.SECRETKEY, {
        expiresIn: '10d',
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 264 * 3600000),
      });

      res.status(201).json({
        success: true,
        data: 'Đăng nhập thành công',
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'Email or password is incorrect' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

const refresh = asyncHandler(async (req, res) => {
  try {
    const { _id, email } = req.user;
    const token = jwt.sign({ _id, email }, process.env.SECRETKEY, {
      expiresIn: '10d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 264 * 3600000),
    });
    res.status(200).json({ success: true, message: 'Token refreshed' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Token invalid' });
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

const Userupdate = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  }
  const { name, email, currentPassword, newPassword } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.isAdmin = isAdmin || user.isAdmin;
  user.password = password || user.password;
  user.phone = phone || user.phone;

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
    phone: updatedUser.phone,
    token: generateAccessToken(updatedUser._id),
  });
});

//6. UPDATE USER BY ID

const updateUserById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params._id);
  if (!user) {
    res.status(404).json({ message: `Can't find users` });
  }
  const { name, email, isAdmin, password, phone } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.isAdmin = isAdmin || user.isAdmin;
  user.password = password || user.password;
  user.phone = phone || user.phone;
  const updatedUser = await user.save();
  res.json({
    name: updatedUser.name,
    email: updatedUser.email,
    password: updatedUser.password,
    avatar: updatedUser.avatar,
    isAdmin: updatedUser.isAdmin,
    phone: updatedUser.phone,
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

module.exports = {
  getAllUser,
  register,
  authLogin,
  profileUser,
  Userupdate,
  updateUserById,
  deleted,
  refresh,
};
