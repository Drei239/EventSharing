const { createError } = require("./errorHandle");
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split("")[1];
    } else {
      createError(400, "Not Author token expried, Please login again");
    }
    if (token) {
      jwt.verify(token, `${process.env.JWT_KEY}`, (err, user) => {
        if (err) {
          throw next(err);
        }
        req.user = user;
        next();
      });
    } else {
      throw createError(401, "Not Authoried token expried, Please login again");
    }
  } catch (err) {
    next(err);
  }
};
const checkisUser = async (req, res, next) => {
  try {
    authMiddleware(req, res, (err) => {
      if (err) {
        return next(err);
      }
      if (req.user.id !== req.params.id) {
        return next(createError(401, "You are not authorized"));
      } else {
        next();
      }
    });
  } catch (err) {
    next(err);
  }
};
const verifyAmin = (req, res, next) => {
  authMiddleware(req, res, (err) => {
    if (err) {
      next(err);
    }
    if (!req.user.isAdmin) {
      return next(createError(401, "You are not Amin"));
    } else {
      next();
    }
  });
};
module.exports = { authMiddleware, verifyAmin, checkisUser };
