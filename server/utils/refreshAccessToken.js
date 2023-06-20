const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const refreshAccessToken = (token) => {
  try {
    const verifyToken = jwt.verify(token, process.env.REFRESHKEY);
    const accessToken = jwt.sign(
      { _id: verifyToken._id },
      process.env.SECRETKEY,
      { expiresIn: process.env.EXPIRETIME_ACCESS }
    );
    return accessToken;
  } catch (error) {
    return false;
  }
};

module.exports = { refreshAccessToken };