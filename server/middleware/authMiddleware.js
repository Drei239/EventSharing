const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const userVerify = jwt.verify(token, process.env.JWT_SECRET);
      const userId = userVerify.id;
      const userInfo = await userModel.findById(userId).select('-password');
      req.user = userInfo;
      next();
    } catch (e) {
      res.status(401);
      throw new Error('token invalid');
    }
  } else {
    res.status(401);
    throw new Error('Not authorization or no token');
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Member is not Admin');
  }
};

module.exports = {
  protect,
  isAdmin,
};