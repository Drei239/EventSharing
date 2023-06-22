const asyncHandler = require("express-async-handler");
const orderModel = require("../models/orderModel");
const eventModel = require("../models/eventModel");
const orderValidator = require("../validators/orderValidators");
const resMes = require("../validators/responsiveMessages");

//1.CREATE NEW ORDER
const createNewOrder = asyncHandler(async (event, user, creator) => {
  const existOrder = await orderModel.findOne({
    event: event,
    user: user,
    creator,
  });
  const eventOrder = await eventModel.findOne({ _id: event });
  const listOrder = await orderModel.find({ event: event });

  if (orderValidator.existOrderValidation(existOrder)) {
    if (orderValidator.limitUserValidation(eventOrder.limitUser, listOrder)) {
      const newOrder = await orderModel.create({
        event,
        user,
        creator,
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
    const orders = await orderModel.find({ event: requestEvent })
        .populate("event")
        .populate("user", "name");
    if (orders && orders.length !== 0) {
        return orders;
    } else {
        throw Error(resMes.orderError.ERR_3);
    }
});

//3.UPDATE ALL ORDER
const updateAllByEventId = asyncHandler(async (requestEvent, isPaid, isRefund, isJoined) => {
    //LOGIN KIỂM TRA REQUEST USER ID = CREATOR -> CHO PHÉP UPDATE
    const updateOrders = await orderModel.updateMany({ event: requestEvent }, {
        $set: {
            isPaid: isPaid,
            isRefund: isRefund,
            isJoined: isJoined,
        }
    });
    if (updateOrders && updateOrders.matchedCount != 0) {
        return updateOrders;
    } else {
        throw Error(resMes.orderError.ERR_5);
    }
});

//4.UPDATE REQUEST ORDER
const updateRequestOrder = asyncHandler(async (requestUserId, requestEventId, updateData) => {
    const requestEvent = await eventModel.findOne({ _id: requestEventId });
    if (requestEvent.creator.toString() === requestUserId.toString()) {
        const updateOrder = await orderModel.bulkWrite(updateData.map((data) => ({
            updateOne: {
                filter: { _id: data.orderId, event: requestEventId },
                update: { isPaid: data.isPaid, isJoined: data.isJoined, isRefund: data.isRefund }
            }
        })));
        console
        if (updateOrder && updateOrder.matchedCount != 0) {
            return updateOrder;
        } else {
            throw Error(resMes.orderError.ERR_5);
        }
    } else {
        throw Error(resMes.orderError.ERR_6);
    }
});

const updateOrder = async ({ creatorId, orderId, data }) => {
  const findOrder = await orderModel.findById(orderId).populate("event user");
  if (!findOrder) {
    throw Error(resMes.orderError.ERR_3);
  }
  if (findOrder?.event?.creator.toString() !== creatorId.toString()) {
    throw Error("BẠN KHÔNG PHẢI NGƯỜI TỔ CHỨC SỰ KIỆN");
  }
  findOrder.isPaid = data.isPaid || findOrder.isPaid;
  findOrder.isRefund = data.isRefund || findOrder.isRefund;
  findOrder.isJoined = data.isJoined || findOrder.isJoined;

  return findOrder;
};

module.exports = { createNewOrder, getOrdersByEventId, updateOrder, updateAllByEventId, updateRequestOrder };
