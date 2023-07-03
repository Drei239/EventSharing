const asyncHandler = require("express-async-handler");
const commentModel = require("../models/commentModel");
const eventModel = require("../models/eventModel");
const notifyModel = require("../models/notifyModel");
const resMes = require("../validators/responsiveMessages");

//1.CREATE NEW COMMENT
const createNewComment = asyncHandler(
  async (title, comment, requestEventId, requestUserId) => {
    const event = requestEventId;
    const existEvent = await eventModel.findById(requestEventId);

    if (!existEvent) {
      throw Error(resMes.eventError.ERR_4);
    }
    const creator = requestUserId;
    const newComment = await commentModel.create({
      title,
      comment,
      event,
      creator,
    });
    if (newComment) {
      await notifyModel.create({
        notifyFrom: creator,
        notifyTo: existEvent.creator,
        notifyType: "new-comment",
        commentId: newComment._id,
        content: `đã bình luận trong sự kiện của bạn`,
      });
      return newComment;
    } else {
      throw Error(resMes.commentError.ERR_1);
    }
  }
);

//2.GET COMMENT BY EVENT ID
const getCommentByEventId = asyncHandler(async (requestEventId) => {
  const comments = await commentModel
    .find({ event: requestEventId })
    .populate("event", "title")
    .populate("creator", "name avatar")
    .populate("reply.creator", "name avatar");
  if (comments && comments.length != 0) {
    return comments;
  } else {
    throw Error(resMes.commentError.ERR_2);
  }
});

//3.UPDATE COMMENT BY COMMENT ID
const updateCommentById = asyncHandler(
  async (requestCommentId, requestUserId, title, comment) => {
    const updateComment = await commentModel.findOne({ _id: requestCommentId });
    if (updateComment) {
      if (requestUserId.toString() === updateComment.creator.toString()) {
        updateComment.title = title || updateComment.title;
        updateComment.comment = comment || updateComment.comment;
        const updatedComment = await updateComment.save();
        return updatedComment;
      } else {
        throw Error(resMes.commentError.ERR_3);
      }
    } else {
      throw Error(resMes.commentError.ERR_2);
    }
  }
);

//4.DELETE COMMENT BY COMMENT ID
const deleteCommentById = asyncHandler(
  async (requestCommentId, requestUserId) => {
    const deleteComment = await commentModel.findOne({ _id: requestCommentId });
    if (deleteComment) {
      if (requestUserId.toString() === deleteComment.creator.toString()) {
        await commentModel.findByIdAndDelete(requestCommentId);
        return true;
      } else {
        throw Error(resMes.commentError.ERR_4);
      }
    } else {
      throw Error(resMes.commentError.ERR_2);
    }
  }
);

//5.CREATE NEW REPLY COMMENT BY COMMENT ID
const replyCommentById = asyncHandler(
  async (requestUserId, requestCommentId, title, comment) => {
    const requestComment = await commentModel.findOne({
      _id: requestCommentId,
    });
    if (requestComment) {
      requestComment.reply.push({
        title: title,
        comment: comment,
        creator: requestUserId.toString(),
      });
      await requestComment.save();
      return requestComment;
    } else {
      throw Error("KHÔNG TÌM THẤY COMMENT!");
    }
  }
);

//6.UPDATE REPLY COMMENT BY COMMENT ID AND REPLY COMMENT ID
const updateReplyComment = asyncHandler(async (
  requestUserId, requestCommentId, replyId, title, comment) => {
  const existReply = await commentModel.findOne(
    { _id: requestCommentId, "reply._id": replyId });
  if (existReply) {
    const updateReply = await commentModel.findOne(
      { _id: requestCommentId }).select({ reply: { $elemMatch: { _id: replyId } } });
    if (updateReply.reply[0].creator.toString() === requestUserId.toString()) {
      const updateReply = await commentModel.updateOne({ _id: requestCommentId, "reply._id": replyId },
        {
          $set: {
            "reply.$.title": title,
            "reply.$.comment": comment
          }
        });
      return updateReply;
    } else {
      throw Error(resMes.commentError.ERR_3);
    }

  } else {
    throw Error(resMes.commentError.ERR_2);
  }
});

//7.DELETE REPLY COMMENT BY COMMENT ID & REPLY COMMENT ID
const deleteReplyComment = asyncHandler(async (
  requestUserId, requestCommentId, replyId) => {
  const existReply = await commentModel.findOne(
    { _id: requestCommentId, "reply._id": replyId });
  if (existReply) {
    const deleteComment = await commentModel.findOne(
      { _id: requestCommentId }).select({ reply: { $elemMatch: { _id: replyId } } });
    if (deleteComment.reply[0].creator.toString() === requestUserId.toString()) {
      await commentModel.updateOne(
        { _id: requestCommentId }, { $pull: { reply: { _id: replyId } } });
      return true;
    } else {
      throw Error(resMes.commentError.ERR_4);
    }
  } else {
    throw Error(resMes.commentError.ERR_2);
  }
});

module.exports = {
  createNewComment,
  getCommentByEventId,
  updateCommentById,
  deleteCommentById,
  replyCommentById,
  updateReplyComment,
  deleteReplyComment
};
