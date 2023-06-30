const express = require("express");
const router = express.Router();
const {
  createNewOrder,
  getOrdersByEventId,
  updateOdrder,
  updateAllByEventId,
  updateRequestOrder,
  sendEmailtoId,
  sendEmailAllOrder,
  exportData
} = require("../controllers/orderController");
const { protect, verifyUser } = require("../middleware/authMiddleware");

//1.CREATE NEW ORDER
router.post("/create", protect, createNewOrder);

router.put("/update/:id", protect, updateOdrder);

//2.GET ORDERS BY EVENT ID
router.get("/event/:id", getOrdersByEventId);

//3.UPDATE "ALL ORDER" BY EVENT ID
router.put("/event/:id/updateAll", protect, updateAllByEventId);

//4.UPDATE "REQUEST ORDERS"
router.put("/event/:id/updateRequest", protect, updateRequestOrder);

//5.EXPORT ORDER DATA TO EXCEL BY EVENT ID
router.get("/export/event/:id", exportData);

router.post("/send-email", protect, sendEmailtoId);

router.post("/send-allOrder", protect, sendEmailAllOrder);
module.exports = router;
