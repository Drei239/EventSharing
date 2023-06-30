const notifyModel = require("../models/notifyModel");
const getAllNotify = async (userId, query) => {
  const { page = 1, pagesize = 10, notifyType } = query;
  const skip = (page - 1) * pagesize;
  const notify = await notifyModel
    .find({ notifyTo: userId })
    .skip(skip)
    .limit(pagesize)
    .sort("-createdAt");
  return notify;
};
module.exports = { getAllNotify };
