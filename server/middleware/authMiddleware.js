const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { refreshAccessToken } = require("../utils/refreshAccessToken");
require("dotenv").config({ path: ".env" });
const userModel = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refresh;

  if (accessToken) {
    try {
      const userVerify = jwt.verify(accessToken, process.env.SECRETKEY);
      const userId = userVerify._id;
      const userInfo = await userModel.findById(userId).select("-password");
      req.user = userInfo;
      return next();
    } catch (error) {
      res.statusCode(400);
      throw new Error("Token invalid");
    }
  } else {
    const newToken = refreshAccessToken(refreshToken);
    if (newToken) {
      req.token = newToken;
      return next();
    } else {
      res.statusCode(400);
      throw new Error("Token invalid");
    }
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Member is not admin");
  }
};
const verifyUser = (req, res, next) => {
  protect(req, res, (err) => {
    if (err) {
      next(err);
    } else if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(401, "You are not authorized"));
    }
  });
};
module.exports = { protect, isAdmin, verifyUser };
