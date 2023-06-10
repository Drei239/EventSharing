const jwt = require('jsonwebtoken');

const verifyRefreshToken = (refreshToken) => {
  const privateKey = process.env.JWT_SECRET_REFRESH_TOKEN;

  try {
    const tokenDetails = jwt.verify(refreshToken, privateKey);
    return {
      tokenDetails,
      status: true,
      message: 'Valid refresh token',
    };
  } catch (err) {
    throw { status: false, message: 'Invalid refresh token' };
  }
};

module.exports = verifyRefreshToken;
