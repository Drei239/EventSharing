const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const userModel = require('../models/userModel');
const { required } = require('joi');

const protect = asyncHandler(async (req, res, next) => {
  // const authorization = req.headers.authorization;
  // if (authorization && authorization.startsWith('Bearer')) {
  //   try {
  //     const token = req.headers.authorization.split(' ')[1];
  //     const userVerify = jwt.verify(token, process.env.JWT_SECRET);
  //     const userId = userVerify.id;
  //     const userInfo = await userModel.findById(userId).select('-password');
  //     req.user = userInfo;
  //     next();
  //   } catch (e) {
  //     res.status(400);
  //     throw new Error('Token invalid');
  //   }
  // }

  const token = req.cookies.token;
  console.log(token);

  if (token) {
    try {
      const userVerify = jwt.verify(token, process.env.SECRETKEY);
      const userId = userVerify._id;
      const userInfo = await userModel.findById(userId).select('-password');
      req.user = userInfo;
      next();
    } catch (error) {
      res.status(400);
      throw new Error('Token invalid');
    }
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Member is not admin');
  }
};

const checkToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const userVerify = jwt.verify(token, process.env.SECRETKEY);
      const userId = userVerify._id;
      const userInfo = await userModel.findById(userId).select('-password');
      req.user = userInfo;
      next();
    } catch (error) {
      res.status(400);
      throw new Error('Token invalid');
    }
  }
});

module.exports = { protect, isAdmin };
