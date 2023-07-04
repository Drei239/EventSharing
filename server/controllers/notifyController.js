const notifySevice = require("../services/notifyService");
const asyncHandler = require("express-async-handler");
const { notifySucc } = require("../validators/responsiveMessages");
const getAllNotify = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const query = req.query;
  try {
    const notify = await notifySevice.getAllNotify(userId, query);

    res
      .status(200)
      .json({
        status: 200,
        data: notify.notify,
        message: notifySucc.SUC_1,
        countDocument: notify.countDocument,
      });
  } catch (err) {
    next(err);
  }
});
const markAsReadById = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  try {
    const notify = await notifySevice.markAsRead(userId, id);
    res
      .status(200)
      .json({ status: 200, message: notifySucc.SUC_2, data: notify });
  } catch (err) {
    next(err);
  }
});
const maskAsReadAll = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    await notifySevice.markAsReadAll(userId);
    res.status(200).json({ status: 200, message: notifySucc.SUC_2 });
  } catch (err) {
    next(err);
  }
});
const readConfirmNew = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    await notifySevice.readConfrimNotify(userId);
    res.status(200).json({ status: 200, message: notifySucc.SUC_2 });
  } catch (err) {
    next(err);
  }
});
module.exports = {
  getAllNotify,
  maskAsReadAll,
  markAsReadById,
  readConfirmNew,
};
