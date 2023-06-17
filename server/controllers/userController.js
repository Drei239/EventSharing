const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { getPersonalUser } = require("../services/userService");

const createJwt = (value) => {
  try {
    const accessToken = jwt.sign({ _id: value }, process.env.SECRETKEY, {
      expiresIn: process.env.EXPIRETIME_ACCESS,
    });

    const refreshToken = jwt.sign({ _id: value }, process.env.REFRESHKEY, {
      expiresIn: process.env.EXPIRETIME_REFRESH,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return false;
    throw new Error("Create jwt error");
  }
};

//1.GET ALL USER INFO
const getAllUser = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.json(users);
});

const checkAccount = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const emailExists = await userModel.findOne({ email: email.toLowerCase() });
  if (emailExists) {
    res.json({ accountExists: true });
  } else {
    res.json({ accountExists: false });
  }
});

//2.REGISTER NEW USER
const register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const userExists = await userModel.findOne({ email: lowerCaseEmail });
  if (userExists) {
    return res.status(400).json({ message: "Email đã có tài khoản" });
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
      data: "Tạo tài khoản thành công",
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Tạo tài khoản thất bại" });
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
      if (jwt) {
        res.cookie("access", jwt.accessToken, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 2 * 3600000),
        });

        res.cookie("token", jwt.token, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 2 * 3600000),
        });

        res.cookie("refresh", jwt.refreshToken, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 720 * 3600000),
        });
        res.cookie("refresh", jwt.refreshToken, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 720 * 3600000),
        });

        res.status(201).json({
          success: true,
          data: "Đăng nhập thành công",
        });
        res.end();
      } else {
        res.status(400);
        throw new Error("Create token fail");
      }
      res.status(201).json({
        success: true,
        data: "Đăng nhập thành công",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Email or password is incorrect" });
    }
  } else {
    const jwt = createJwt(user._id);

    if (jwt) {
      res.cookie("access", jwt.accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 2 * 3600000),
      });
      res.cookie("token", jwt.token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 2 * 3600000),
      });

      res.cookie("refresh", jwt.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 720 * 3600000),
      });
      res.cookie("refresh", jwt.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 720 * 3600000),
      });

      res.status(201).json({
        success: true,
        data: "Đăng nhập thành công",
      });
    } else {
      res.status(400);
      throw new Error("Create token fail");
    }
    res.status(201).json({
      success: true,
      data: "Đăng nhập thành công",
    });
  }
});

//4. GET USER PROFILE
const profileUser = asyncHandler((req, res) => {
  const user = req.user;
  const token = req.token;

  if (token) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 2 * 3600000),
    });
  }

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
    avatar,
    name,
    email,
    oldPassword,
    newPassword,
    phone,
    birthDay,
    description,
    gender,
  } = req.body;

  if (oldPassword) {
    const passwordVerify = await bcrypt.compare(oldPassword, user.password);
    if (passwordVerify && newPassword) {
      user.password = passwordVerify;
    }
  } else {
    if (newPassword) {
      user.password = newPassword;
    }
  }
  user.name = name || user.name;
  user.email = email || user.email;
  // user.isAdmin = isAdmin || user.isAdmin;
  user.phone = phone || user.phone;
  user.birthDay = birthDay || user.birthDay;
  user.description = description || user.description;
  user.gender = gender || user.gender;
  user.avatar = avatar || user.avatar;
  const updatedUser = await user.save();

  const token = req.token;
  if (token) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 2 * 3600000),
    });
  }

  if (updatedUser) {
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } else {
    console.log(err);
    next(err);
  }
});

//7. DELETE USER
const deleted = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ message: "Deletion failed" });
  }
  res.status(200).json({ message: "Delete successfully" });
});

// Log Out
const logout = (req, res) => {
  res.clearCookie("access");
  res.clearCookie("refresh");
  res.clearCookie("token");
  res.clearCookie("refresh");
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
      res.cookie("access", newToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 2 * 3600000),
      });
      res.status(200).end();
    }
  } else {
    res.clearCookie("access");
    res.clearCookie("refresh");
    res.status(401);
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
  checkAccount,
  refreshToken,
  getPersonalUser,
};
