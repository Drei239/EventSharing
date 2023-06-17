const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};
const handleError = async (err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "something went wrong";
  return res
    .status(errStatus)
    .json({ status: errStatus, message: errMessage, stack: err.stack });
};
module.exports = { createError, handleError };
