const asyncHandler = require('express-async-handler');
const commentService = require('../services/commentServices');
const resMes = require('../validators/responsiveMessages');

//1.
const createNewComment = asyncHandler(async (req, res) => {
    const requestUserId = req.user._id;
    const requestEventId = req.params.id;
    const { title, comment } = req.body;
    try {
        const newComment = await commentService.createNewComment(title, comment, requestEventId, requestUserId);
        return res
            .status(200)
            .json({ status: 200, data: newComment, message: resMes.commentSucc.SUC_1 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
});

//2.
const getCommentByEventId = asyncHandler(async (req, res) => {
    const requestEventId = req.params.id;
    try {
        const comments = await commentService.getCommentByEventId(requestEventId);
        return res
            .status(200)
            .json({ status: 200, data: comments, message: resMes.commentSucc.SUC_2 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
});

//3.
const updateCommentById = asyncHandler(async (req, res) => {
    const requestCommentId = req.params.id;
    const requestUserId = req.user._id;
    const { title, comment } = req.body
    try {
        const updatedComment = await commentService.updateCommentById(
            requestCommentId, requestUserId, title, comment);
        return res
            .status(200)
            .json({ status: 200, data: updatedComment, message: resMes.commentSucc.SUC_3 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
});

//4.
const deleteCommentById = asyncHandler(async (req, res) => {
    const requestCommentId = req.params.id;
    const requestUserId = req.user._id;
    try {
        await commentService.deleteCommentById(requestCommentId, requestUserId);
        return res
            .status(200)
            .json({ status: 200, message: resMes.commentSucc.SUC_4 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
});

//5.
const replyCommentById = asyncHandler(async (req, res) => {
    const requestUserId = req.user._id;
    const requestCommentId = req.params.id;
    const { title, comment } = req.body;
    try {
        const reply = await commentService.replyCommentById(
            requestUserId,
            requestCommentId,
            title, comment);
        return res
            .status(200)
            .json({ status: 200, data: reply, message: resMes.commentSucc.SUC_1 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
})
module.exports = {
    createNewComment,
    getCommentByEventId,
    updateCommentById,
    deleteCommentById,
    replyCommentById
};