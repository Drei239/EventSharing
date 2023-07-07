const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const userService = require('../services/userService');
const createJwt = (value) => {
  try {
    const token = jwt.sign({ _id: value }, process.env.SECRETKEY, {
      expiresIn: process.env.EXPIRETIME_ACCESS,
    });

    const refreshToken = jwt.sign({ _id: value }, process.env.REFRESHKEY, {
      expiresIn: process.env.EXPIRETIME_REFRESH,
    });

    return { token, refreshToken };
  } catch (error) {
    throw new Error('Create jwt error');
  }
};

//1.GET ALL USER INFO
const getAllUser = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.json(users);
});

//2.REGISTER NEW USER
const register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;
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
      avatar,
    });
  }

  if (newUser) {
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
  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const user = await userModel.findOne({ email: lowerCaseEmail });
  if (user.password) {
    if (user && (await bcrypt.compare(password, user.password))) {
      const jwt = createJwt(user._id);

      res.cookie('access', jwt.token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 2 * 3600000),
      });

      res.cookie('refresh', jwt.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 720 * 3600000),
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
  } else {
    const jwt = createJwt(user._id);

    res.cookie('access', jwt.token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 2 * 3600000),
    });

    res.cookie('refresh', jwt.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 720 * 3600000),
    });

    res.status(201).json({
      success: true,
      data: 'Đăng nhập thành công',
    });
  }
});

//4. GET USER PROFILE
const profileUser = asyncHandler((req, res) => {
  const user = req.user;
  res.status(200).json(user);
  res.end();
});

//6. UPDATE USER BY ID
const updateUserById = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: `Can't find users` });
  }

  const {
    name,
    email,
    avatar,
    oldPassword,
    newPassword,
    phone,
    birthDay,
    description,
    gender,
  } = req.body;
  if (oldPassword) {
    const passwordVerify = await bcrypt.compare(oldPassword, user.password);
    if (!passwordVerify) {
      res.status(400).json({ status: 400, message: 'Password is not match' });
    }
    if (passwordVerify && newPassword) {
      user.password = newPassword;
    }
  } else {
    if (newPassword && req.user.isAdmin) {
      user.password = newPassword;
    }
  }
  user.name = name || user.name;
  user.email = email || user.email;
  // user.isAdmin = isAdmin || user.isAdmin;
  user.phone = phone || user.phone;
  user.birthDay = birthDay || user.birthDay;
  user.description = description || user.description;
  user.avatar = avatar || user.avatar;
  user.gender = gender || user.gender;
  const updatedUser = await user.save();

  if (updatedUser) {
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } else {
    res.status(400);
    throw new Error('Update fail');
  }
});

//7. DELETE USER
const deleted = asyncHandler(async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ status: 400, message: 'User not found' });
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword) {
      if (!req.user?.isAdmin) {
        res.status(400).json({ status: 400, message: 'Mật khẩu không đúng' });
      } else {
        await userModel.findByIdAndDelete(user._id);
        res.status(200).json({ message: 'Delete successfully' });
      }
    } else {
      await userModel.findByIdAndDelete(user._id);
      res.status(200).json({ message: 'Delete successfully' });
    }
  } catch (err) {
    next(err);
  }
});
const ratingUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const youId = req.user._id;
  try {
    const updateRating = await userService.ratingUser({
      id: id,
      comments: req.body,
      youId: youId,
    });
    res
      .status(200)
      .json({ status: 200, data: updateRating, message: 'comment thanh cong' });
  } catch (err) {
    next(err);
  }
});
const highlightUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await userService.highlightUser();
    res
      .status(200)
      .json({ status: 200, data: user, message: 'get User thanh cong' });
  } catch (err) {
    next(err);
  }
});

// Logout
const logout = (req, res) => {
  res.clearCookie('access');
  res.clearCookie('refresh');
  res.end();
};

// check refresh token or not
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh;
  const refreshVerify = jwt.verify(refreshToken, process.env.REFRESHKEY);

  if (refreshVerify._id) {
    const newToken = jwt.sign(
      { _id: refreshVerify._id },
      process.env.SECRETKEY,
      {
        expiresIn: process.env.EXPIRETIME_ACCESS,
      }
    );
    if (newToken) {
      res.cookie('access', newToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 2 * 3600000),
      });
      res.status(200).end();
    }
  } else {
    res.clearCookie('access');
    res.clearCookie('refresh');
    res.status(401).end();
  }
});

const getOrganizers = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await userModel.findById(id).select('-password');
  console.log(result);
  if (result) {
    res.status(200).json(result);
  }
});
//FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await userService.forgotPassword(email);
    res
      .status(200)
      .json({ status: 200, data: result, message: 'Gửi link thành công' });
  } catch (err) {
    next(err);
  }
});
const resetPassword = asyncHandler(async (req, res, next) => {
  const { userId, token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await userService.resetPassword(userId, token, newPassword);
    res.status(200).json({
      status: 200,
      message: 'Thay đổi mật khẩu thành công',
      data: user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
module.exports = {
  getAllUser,
  register,
  authLogin,
  profileUser,
  updateUserById,
  deleted,
  logout,
  ratingUser,
  highlightUser,
  refreshToken,
  getOrganizers,
  forgotPassword,
  resetPassword,
};
