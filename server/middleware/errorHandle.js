const httpError = require("http-errors");
const createError = (status, message) => {
  throw httpError(status, message);
};
const handleError = async (err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "something went wrong";
  return res.status(errStatus).json({ status: errStatus, message: errMessage });
};
module.exports = { createError, handleError };
