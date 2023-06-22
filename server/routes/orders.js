const express = require('express');
const router = express.Router();
const { createNewOrder, getOrdersByEventId,
    updateAllByEventId, updateRequestOrder } = require('../controllers/orderController');

//1.CREATE NEW ORDER
router.post("/create", createNewOrder);

//2.GET ORDERS BY EVENT ID
router.get("/event/:id", getOrdersByEventId);

//3.UPDATE ALL ORDER BY EVENT ID
router.put("/event/:id/updateAll", updateAllByEventId);

//4.UPDATE REQUEST ORDERS
router.put("/event", updateRequestOrder);

module.exports = router;