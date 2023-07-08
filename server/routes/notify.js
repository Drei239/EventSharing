const express = require("express");
const {
  getAllNotify,
  markAsReadById,
  maskAsReadAll,
  readConfirmNew,
} = require("../controllers/notifyController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/get-all", protect, getAllNotify);
router.put("/mark-read/:id", protect, markAsReadById);
router.put("/mark-all", protect, maskAsReadAll);
router.put("/confirm-new", protect, readConfirmNew);
module.exports = router;
