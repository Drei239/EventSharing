const asyncHandler = require('express-async-handler');
const orderModel = require('../models/orderModel');
const orderService = require('../services/orderServices');
const resMes = require("../validators/responsiveMessages");

//1.CREATE NEW ORDER
const createNewOrder = asyncHandler(async (req, res) => {
    //SAU KHI LOGIN USER = REQUEST USER ID
    const { event, user } = req.body;
    try {
        const newOrder = await orderService.createNewOrder(event, user);
        return res.status(200).json({ status: 200, data: newOrder, message: resMes.orderSucc.SUCC_1 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
})

//2.GET ALL ORDER OF EVENT BY ID
const getOrdersByEventId = asyncHandler(async (req, res) => {
    const requestEvent = req.params.id;
    try {
        const orders = await orderService.getOrdersByEventId(requestEvent);
        return res.status(200).json({ status: 200, data: orders, message: resMes.orderSucc.SUCC_2 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
})

//3.PUT - UPDATE ALL ORDER
const updateAllByEventId = asyncHandler(async (req, res) => {
    //LOGIN KIỂM TRA REQUEST USER ID = CREATOR -> CHO PHÉP UPDATE
    const requestEvent = req.params.id;
    const { isPaid, isRefund, isJoined } = req.body;
    try {
        const orders = await orderService.updateAllByEventId(requestEvent, isPaid, isRefund, isJoined);
        return res.status(200).json({ status: 200, data: orders, message: resMes.orderSucc.SUCC_3 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
})

//4.PUT - UPDATE REQUEST ORDERS
const updateRequestOrder = asyncHandler(async (req, res) => {
    const updateData = req.body;
    try {
        const orders = await orderService.updateRequestOrder(updateData);
        return res.status(200).json({ status: 200, data: orders, message: resMes.orderSucc.SUCC_3 });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
})

module.exports = {
    createNewOrder, getOrdersByEventId,
    updateAllByEventId, updateRequestOrder
}