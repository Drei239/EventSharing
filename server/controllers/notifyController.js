const notifySevice = require("../services/notifyService");
const asyncHandler = require("express-async-handler");
const { notifySucc } = require("../validators/responsiveMessages");
const getAllNotify = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const query = req.query;
  try {
    const notify = notifySevice.getAllNotify(userId, query);
    res
      .status(200)
      .json({ status: 200, data: notify, message: notifySucc.SUC_1 });
  } catch (err) {
    next(err);
  }
});

module.exports = { getAllNotify };
