const express = require('express');
const router = express.Router();
const {
    createNewComment,
    getCommentByEventId,
    updateCommentById,
    deleteCommentById,
    replyCommentById
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
router.put("/update/:id/reply", protect, replyCommentById);

module.exports = router;

