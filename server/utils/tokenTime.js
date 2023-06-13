const jwt = require('jsonwebtoken');
const UserToken = require('../models/userTokenModel');
const verifyRefreshToken = require('./verifyRefreshToken');

const { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN, JWT_EXPRIRE_REFRESH_TOKEN, JWT_EXPRIRE_ACCESS_TOKEN } =
  process.env;

const generateToken = async (user) => {
  try {
    const payload = { user };
    const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_EXPRIRE_ACCESS_TOKEN });
    let refreshToken = '';

    const existUserToken = await UserToken.findOne({ userId: user._id });

    if (existUserToken) {
      refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_EXPRIRE_REFRESH_TOKEN });
      existUserToken.token = refreshToken;
      await existUserToken.save();
    } else {
      refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_EXPRIRE_REFRESH_TOKEN });

      await UserToken.create({ userId: user._id, token: refreshToken });
    }
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
};

const generateAccessToken = async (refreshToken) => {
  try {
    const doc = await UserToken.findOne({ token: refreshToken }).exec();
    if (!doc) {
      throw { status: false, message: 'Invalid refresh token' };
    }

    const { tokenDetails } = verifyRefreshToken(refreshToken);
    const payload = tokenDetails.user;
    const accessToken = jwt.sign({ user: payload }, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: process.env.JWT_EXPRIRE_ACCESS_TOKEN,
    });

    return {
      accessToken,
      message: 'Access token created successfully',
    };
  } catch (err) {
    throw err;
  }
};

const decodedAccessToken = (token) => {
  return jwt.decode(token, JWT_SECRET_ACCESS_TOKEN);
};

module.exports = { generateToken, decodedAccessToken, generateAccessToken };
