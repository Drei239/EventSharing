const asyncHandler = require('express-async-handler');
const commentModel = require('../models/commentModel');
const resMes = require('../validators/responsiveMessages');

//1.CREATE NEW COMMENT
const createNewComment = asyncHandler(async (title, comment, requestEventId, requestUserId) => {
    const event = requestEventId;
    const creator = requestUserId;
    const newComment = await commentModel.create({
        title,
        comment,
        event,
        creator
    });
    if (newComment) {
        return newComment;
    } else {
        throw Error(resMes.commentError.ERR_1);
    }
});

//2.GET COMMENT BY EVENT ID
const getCommentByEventId = asyncHandler(async (requestEventId) => {
    const comments = await commentModel.find({ event: requestEventId });
    if (comments && comments.length != 0) {
        return comments;
    } else {
        throw Error(resMes.commentError.ERR_2);
    }
});

//3.UPDATE COMMENT BY COMMENT ID
const updateCommentById = asyncHandler(async (requestCommentId, requestUserId, title, comment) => {
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
});

//4.DELETE COMMENT BY COMMENT ID
const deleteCommentById = asyncHandler(async (requestCommentId, requestUserId) => {
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
});

module.exports = {
    createNewComment,
    getCommentByEventId,
    updateCommentById,
    deleteCommentById
};