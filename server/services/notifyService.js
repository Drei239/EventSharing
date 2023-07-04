const notifyModel = require("../models/notifyModel");
const { notifyErr } = require("../validators/responsiveMessages");
const getAllNotify = async (userId, query) => {
  const { page = 1, pagesize = 10, notifyTypeRead } = query;
  const skip = (page - 1) * pagesize;
  let notify;
  if (notifyTypeRead.toString() === "unRead") {
    notify = notifyModel.find({
      notifyTo: userId.toString(),
      isReadMessage: false,
    });
  } else {
    notify = notifyModel.find({ notifyTo: userId.toString() });
  }

  notify = await notify
    .skip(skip)
    .limit(pagesize)
    .populate({ path: "notifyFrom", select: "name avatar" })
    .populate("commentId")
    .sort("-createdAt");
  const countDocument = await notifyModel
    .find({ notifyTo: userId.toString(), isNew: true })
    .model.countDocuments(
      notifyModel.find({ notifyTo: userId.toString(), isNew: true }).getFilter()
    )
    .exec();

  return { notify, countDocument };
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
const readConfrimNotify = async (userId) => {
  const updateNotify = await notifyModel.updateMany(
    { notifyTo: userId.toString() },
    { isNew: false }
  );
  if (updateNotify && updateNotify.matchedCount !== 0) {
    return updateNotify;
  } else {
    throw Error(notifyErr.ERR_1);
  }
};
module.exports = { getAllNotify, markAsRead, markAsReadAll, readConfrimNotify };
