const express = require('express');
const router = express.Router();
const { createNewOrder, getOrdersByEventId } = require('../controllers/orderController');

//1.CREATE NEW ORDER
router.post("/create", createNewOrder);

//2.GET ORDERS BY EVENT ID
router.get("/event/:id", getOrdersByEventId);

module.exports = router;