const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const verifyRefreshToken = require('../utils/verifyRefreshToken');

const userTokenModel = require('../models/userTokenModel');

const refreshToken = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const doc = await userTokenModel.findOne({ token: refreshToken }).exec();
    if (!doc) {
      throw { status: false, message: 'Invalid refresh token' };
    }
    const { tokenDetails } = verifyRefreshToken(refreshToken);
    if (tokenDetails?.exp * 1000 < Date.now()) {
      throw new Error('jwt expired');
    }

    const payload = tokenDetails.user;

    const accessToken = jwt.sign({ user: payload }, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: process.env.JWT_EXPRIRE_ACCESS_TOKEN,
    });

    res.status(200).json({
      status: true,
      accessToken,
      message: 'Access token created successfully',
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

const deletedToken = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    await userTokenModel.findOneAndDelete({ token: refreshToken });
    res.clearCookie('refreshToken');
    res.status(200).json({ status: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

module.exports = { refreshToken, deletedToken };