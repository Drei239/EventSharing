const express = require('express');
const router = express.Router();
const {
    createNewComment,
    getCommentByEventId,
    updateCommentById,
    deleteCommentById,
    replyCommentById,
    updateReplyComment,
    deleteReplyComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

//1.CREATE NEW COMMENT
router.post("/create/event/:id", protect, createNewComment);

//2.GET COMMENT BY EVENT ID
router.get("/event/:id", getCommentByEventId);

//3.UPDATE COMMENT BY COMMENT ID
router.put("/update/:id", protect, updateCommentById);

//4.DELETE COMMENT BY COMMENT ID
router.delete("/delete/:id", protect, deleteCommentById);

//5.CREATE NEW REPLY COMMENT BY COMMENT ID
router.put("/update/:id/createReply", protect, replyCommentById);

//6.UPDATE REPLY COMMENT BY COMMENT ID AND REPLY COMMENT ID
router.put("/update/:id/updateReply", protect, updateReplyComment);

//7.DELETE REPLY COMMENT BY COMMENT ID AND REPLY COMMENT ID
router.delete("/update/:id/deleteReply", protect, deleteReplyComment);

module.exports = router;

