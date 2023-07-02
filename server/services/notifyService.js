const notifyModel = require("../models/notifyModel");
const { notifyErr } = require("../validators/responsiveMessages");
const getAllNotify = async (userId, query) => {
  const { page = 1, pagesize = 10, notifyType } = query;
  const skip = (page - 1) * pagesize;
  console.log(userId);
  const notify = await notifyModel
    .find({ notifyTo: userId.toString() })
    .skip(skip)
    .limit(pagesize)
    .populate({ path: "notifyFrom", select: "name avatar" })
    .populate("commentId")
    .sort("-createdAt");
  return notify;
};
const markAsRead = async (userId, notifyId) => {
  const updateNotify = await notifyModel.findOneAndUpdate(
    { notifyTo: userId.toString(), _id: notifyId },
    { isReadMessage: true },
    { new: true }
  );
  return updateNotify;
};
const markAsReadAll = async (userId) => {
  const updateNotify = await notifyModel.updateMany(
    { notifyTo: userId.toString() },
    { isReadMessage: true }
  );
  if (updateNotify && updateNotify.matchedCount !== 0) {
    return updateNotify;
  } else {
    throw Error(notifyErr.ERR_1);
  }
};
module.exports = { getAllNotify, markAsRead, markAsReadAll };
