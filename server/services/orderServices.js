const asyncHandler = require('express-async-handler');
const orderModel = require('../models/orderModel');
const eventModel = require("../models/eventModel");
const orderValidator = require("../validators/orderValidators");
const resMes = require("../validators/responsiveMessages");

//1.CREATE NEW ORDER
const createNewOrder = asyncHandler(async (event, user) => {
    const existOrder = await orderModel.findOne({ event: event, user: user });
    const eventOrder = await eventModel.findOne({ _id: event });
    const listOrder = await orderModel.find({ event: event });

    if (orderValidator.existOrderValidation(existOrder)) {
        if (orderValidator.limitUserValidation(eventOrder.limitUser, listOrder)) {
            const newOrder = await orderModel.create({
                event, user
            });
            if (newOrder) {
                return newOrder;
            } else {
                throw Error("NEW ORDER FAILED!");
            }
        } else {
            throw Error(resMes.orderError.ERR_2);
        }
    } else {
        throw Error(resMes.orderError.ERR_1);
    }
});

//2.GET ALL ORDER OF EVENT BY ID
const getOrdersByEventId = asyncHandler(async (requestEvent) => {
    const orders = await orderModel.find({ event: requestEvent }).populate("event").populate("user");
    if (orders && orders.length !== 0) {
        return orders;
    } else {
        throw Error(resMes.orderError.ERR_3);
    }
})

module.exports = { createNewOrder, getOrdersByEventId };