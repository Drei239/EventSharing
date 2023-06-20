const express = require("express");
const router = express.Router();
const {
  createNewOrder,
  getOrdersByEventId,
  updateOdrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
//1.CREATE NEW ORDER
router.post("/create", protect, createNewOrder);

router.put("/update/:id", protect, updateOdrder);
//2.GET ORDERS BY EVENT ID
router.get("/event/:id", getOrdersByEventId);

module.exports = router;
