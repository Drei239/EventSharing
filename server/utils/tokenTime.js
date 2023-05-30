const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPRIRE } = process.env;

const genrateAccessToken = (data) => {
  return jwt.sign({ data }, JWT_SECRET, {
    expiresIn: JWT_EXPRIRE,
  });
};

const decodedAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { genrateAccessToken, decodedAccessToken };