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
    if (existEvent) {
      const creator = requestUserId;
      const newComment = await commentModel.create({
        title,
        comment,
        event,
        creator,
      });
      if (!comment) {
        throw Error(resMes.commentError.ERR_1);
      }
      if (
        newComment &&
        existEvent?.creator.toString() != requestUserId.toString()
      ) {
        const notify = await notifyModel.create({
          notifyFrom: creator,
          notifyTo: existEvent.creator,
          notifyType: "new-comment",
          commentId: newComment._id,
          content: `đã bình luận trong sự kiện của bạn`,
        });
        return { newComment, notify };
      }
      return { newComment };
    } else {
      throw Error(resMes.eventError.ERR_2);
    }
  }
);

//2.GET COMMENT BY EVENT ID
const getCommentByEventId = asyncHandler(async (requestEventId, query) => {
  const { page = 1, limit = 5 } = query;
  const skip = (page - 1) * limit;
  const existEvent = await eventModel.findById(requestEventId);
  if (existEvent) {
    const countDocuments = await commentModel.countDocuments({
      event: requestEventId,
    });
    const comments = await commentModel
      .find({ event: requestEventId })
      .populate("event", "title")
      .populate("creator", "name avatar")
      .populate("reply.creator", "name avatar")
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);

    if (comments && comments.length != 0) {
      return { comments, countDocuments };
    } else {
      throw Error(resMes.commentError.ERR_2);
    }
  } else {
    throw Error(resMes.eventError.ERR_2);
  }
});

//3.UPDATE COMMENT BY COMMENT ID
const updateCommentById = asyncHandler(
  async (requestCommentId, requestUserId, title, comment) => {
    const Comment = await commentModel.findOne({ _id: requestCommentId });
    if (Comment) {
      if (requestUserId.toString() === Comment.creator.toString()) {
        const updateComment = await commentModel
          .findByIdAndUpdate(
            requestCommentId,
            { $set: { title, comment } },
            { new: true }
          )
          .populate("event", "title")
          .populate("creator", "name avatar")
          .populate("reply.creator", "name avatar");
        return updateComment;
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
      const updateComment = await commentModel
        .findByIdAndUpdate(
          requestCommentId.toString(),
          { $push: { reply: { title, comment, creator: requestUserId } } },
          { new: true }
        )
        .populate("event", "title")
        .populate("creator", "name avatar")
        .populate("reply.creator", "name avatar");
      const notify = await notifyModel.create({
        notifyFrom: requestUserId,
        notifyTo: requestComment.creator,
        notifyType: "reply-comment",
        commentId: requestComment,
        replyContent: comment,
        content: `đã phản hồi bình luận của bạn`,
      });
      return { comment: updateComment, notify };
    } else {
      throw Error("KHÔNG TÌM THẤY COMMENT!");
    }
  }
);

//6.UPDATE REPLY COMMENT BY COMMENT ID AND REPLY COMMENT ID
const updateReplyComment = asyncHandler(
  async (requestUserId, requestCommentId, replyId, title, comment) => {
    const existReply = await commentModel.findOne({
      _id: requestCommentId,
      "reply._id": replyId,
    });
    if (existReply) {
      const updateReply = await commentModel
        .findOne({ _id: requestCommentId })
        .select({ reply: { $elemMatch: { _id: replyId } } });
      if (
        updateReply.reply[0].creator.toString() === requestUserId.toString()
      ) {
        const updateReply = await commentModel.updateOne(
          { _id: requestCommentId, "reply._id": replyId },
          {
            $set: {
              "reply.$.title": title,
              "reply.$.comment": comment,
            },
          },
          { new: true }
        );
        console.log(updateReply);
        return updateReply;
      } else {
        throw Error(resMes.commentError.ERR_3);
      }
    } else {
      throw Error(resMes.commentError.ERR_2);
    }
  }
);

//7.DELETE REPLY COMMENT BY COMMENT ID & REPLY COMMENT ID
const deleteReplyComment = asyncHandler(
  async (requestUserId, requestCommentId, replyId) => {
    const existReply = await commentModel.findOne({
      _id: requestCommentId,
      "reply._id": replyId,
    });
    if (existReply) {
      const deleteComment = await commentModel
        .findOne({ _id: requestCommentId })
        .select({ reply: { $elemMatch: { _id: replyId } } });
      if (
        deleteComment.reply[0].creator.toString() === requestUserId.toString()
      ) {
        await commentModel.updateOne(
          { _id: requestCommentId },
          { $pull: { reply: { _id: replyId } } }
        );
        return true;
      } else {
        throw Error(resMes.commentError.ERR_4);
      }
    } else {
      throw Error(resMes.commentError.ERR_2);
    }
  }
);

//8.LIKE COMMENT
const likeComment = asyncHandler(
  async (requestUserId, requestCommentId, replyId) => {
    //TRƯỜNG HỢP LIKE LÀ REPLY COMMENT
    if (replyId) {
      const replyComment = await commentModel
        .findOne({ _id: requestCommentId })
        .select({ reply: { $elemMatch: { _id: replyId } } });
      //REPLY COMMENT TỒN TẠI
      if (replyComment && replyComment.reply.length > 0) {
        //DANH SÁCH USER ĐÃ LIKE
        const likeList = replyComment.reply[0].likeList;
        //SO SÁNH DANH SÁCH USER ĐÃ LIKE VÀ REQUEST USER
        const isFound = likeList.some((element) => {
          if (element.user.toString() === requestUserId.toString()) {
            return true;
          }
          return false;
        });
        if (isFound === false) {
          let likeCount = replyComment.reply[0].likeCount;
          replyComment.reply[0].likeList.push({
            user: requestUserId.toString(),
          });
          await replyComment.save();
          const updateLikeCount = await commentModel.updateOne(
            { _id: requestCommentId, "reply._id": replyId },
            {
              $set: {
                "reply.$.likeCount": likeCount + 1,
              },
            }
          );
        } else {
          let likeCount = replyComment.reply[0].likeCount;
          replyComment.reply[0].likeList.pull({
            user: requestUserId.toString(),
          });
          await replyComment.save();
          const updateLikeCount = await commentModel.updateOne(
            { _id: requestCommentId, "reply._id": replyId },
            {
              $set: {
                "reply.$.likeCount": likeCount - 1,
              },
            }
          );
        }
      } else {
        throw Error(resMes.commentError.ERR_2);
      }
      //TRƯỜNG HỢP LÀ COMMENT
    } else {
      const comment = await commentModel.findOne({ _id: requestCommentId });
      //COMMENT TỒN TẠI
      if (comment) {
        const likedComment = await commentModel.findOne({
          _id: requestCommentId,
          "likeList.user": requestUserId,
        });
        //USER CHƯA LIKE - PUSH VÀO LIKE LIST
        if (!likedComment) {
          await comment.likeList.push({ user: requestUserId.toString() });
          comment.likeCount++;
          await comment.save();
          //USER ĐÃ LIKE - PULL KHỎI LIKE LIST
        } else {
          await comment.likeList.pull({ user: requestUserId.toString() });
          comment.likeCount--;
          await comment.save();
        }
      } else {
        throw Error(resMes.commentError.ERR_2);
      }
    }
  }
);

module.exports = {
  createNewComment,
  getCommentByEventId,
  updateCommentById,
  deleteCommentById,
  replyCommentById,
  updateReplyComment,
  deleteReplyComment,
  likeComment,
};
