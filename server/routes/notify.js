const express = require("express");
const { getAllNotify } = require("../controllers/notifyController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/get-all", protect, getAllNotify);
module.exports = router;
