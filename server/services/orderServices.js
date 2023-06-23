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
const getOrdersByEventId = asyncHandler(
  async ({ requestEvent, keyword, status, sort, page, limit }) => {
    let orders;
    const startIndex = (Number(page) - 1) * limit;
    switch (status) {
      case "unpaid": {
        orders = await orderModel
          .find({ event: requestEvent, isPaid: false })
          .populate("event")
          .populate({
            path: "user",

            match: {
              $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
              ],
            },
          })
          .sort(sort);
        break;
      }
      case "joined": {
        orders = await orderModel
          .find({ event: requestEvent, isJoined: true })
          .populate("event")
          .populate({
            path: "user",

            match: {
              $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
              ],
            },
          })
          .sort(sort);
        break;
      }
      case "refunded": {
        orders = await orderModel
          .find({ event: requestEvent, isRefund: true })
          .populate("event")
          .populate({
            path: "user",

            match: {
              $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
              ],
            },
          })
          .sort(sort);
        break;
      }
      case "paid": {
        orders = await orderModel
          .find({ event: requestEvent, isPaid: true })
          .populate("event")
          .populate({
            path: "user",
            match: {
              $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
              ],
            },
          })
          .sort(sort);
        break;
      }
      default: {
        orders = await orderModel
          .find({ event: requestEvent })
          .populate("event")
          .populate({
            path: "user",
            match: {
              $or: [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
              ],
            },
          })
          .sort(sort);
      }
    }

    const newOrder = await orders.reduce((arr, item) => {
      if (item.user) {
        return [...arr, item];
      } else {
        return arr;
      }
    }, []);
    if (newOrder && newOrder.length !== 0) {
      return {
        countDocument: newOrder.length,
        data: newOrder.slice(startIndex, startIndex + limit),
      };
    } else if (orders && orders.length !== 0) {
      return {
        countDocument: newOrder.length,
        data: [orders[0]],
      };
    } else {
      const eventOrder = await eventModel.findById(requestEvent);

      return {
        countDocument: newOrder.length,
        data: [{ event: eventOrder }],
      };
    }
  }
);

//
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

module.exports = { createNewOrder, getOrdersByEventId, updateOrder };
