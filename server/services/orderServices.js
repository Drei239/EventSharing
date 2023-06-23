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

//3.UPDATE ALL ORDER
const updateAllByEventId = asyncHandler(
  async (requestUserId, requestEventId, isPaid, isRefund, isJoined) => {
    const requestEvent = await eventModel.findOne({ _id: requestEventId });
    if (requestEvent !== null) {
      if (requestEvent.creator.toString() === requestUserId.toString()) {
        const updateOrders = await orderModel.updateMany(
          { event: requestEventId },
          {
            $set: {
              isPaid: isPaid,
              isRefund: isRefund,
              isJoined: isJoined,
            },
          }
        );
        if (updateOrders && updateOrders.matchedCount != 0) {
          return updateOrders;
        } else {
          throw Error(resMes.orderError.ERR_5);
        }
      } else {
        throw Error(resMes.orderError.ERR_6);
      }
    } else {
      throw Error(resMes.orderError.ERR_4);
    }
  }
);

//4.UPDATE REQUEST ORDER
const updateRequestOrder = asyncHandler(
  async (requestUserId, requestEventId, updateData) => {
    const requestEvent = await eventModel.findOne({ _id: requestEventId });
    if (requestEvent !== null) {
      if (requestEvent.creator.toString() === requestUserId.toString()) {
        const updateOrder = await orderModel.bulkWrite(
          updateData.map((data) => ({
            updateOne: {
              filter: { _id: data.orderId, event: requestEventId },
              update: {
                isPaid: data.isPaid,
                isJoined: data.isJoined,
                isRefund: data.isRefund,
              },
            },
          }))
        );
        console;
        if (updateOrder && updateOrder.matchedCount != 0) {
          return updateOrder;
        } else {
          throw Error(resMes.orderError.ERR_5);
        }
      } else {
        throw Error(resMes.orderError.ERR_6);
      }
    } else {
      throw Error(resMes.orderError.ERR_4);
    }
  }
);

const updateOrder = async ({ creatorId, orderId, status }) => {
  const findOrder = await orderModel.findById(orderId).populate("event user");
  if (!findOrder) {
    throw Error(resMes.orderError.ERR_3);
  }
  if (findOrder?.event?.creator.toString() !== creatorId.toString()) {
    throw Error("BẠN KHÔNG PHẢI NGƯỜI TỔ CHỨC SỰ KIỆN");
  }
  switch (status) {
    case "paid": {
      findOrder.isPaid = true;
      findOrder.isRefund = false;
      findOrder.isJoined = false;
      return findOrder;
    }
    case "unpaid": {
      findOrder.isPaid = false;
      findOrder.isRefund = false;
      findOrder.isJoined = false;
      return findOrder;
    }
    case "joined": {
      findOrder.isPaid = true;
      findOrder.isRefund = false;
      findOrder.isJoined = true;
      return findOrder;
    }
    case "refund": {
      findOrder.isPaid = false;
      findOrder.isRefund = true;
      findOrder.isJoined = false;
      return findOrder;
    }
    default:
      findOrder.isPaid = false;
      findOrder.isRefund = false;
      findOrder.isJoined = false;
      return findOrder;
  }
};

module.exports = {
  createNewOrder,
  getOrdersByEventId,
  updateOrder,
  updateAllByEventId,
  updateRequestOrder,
};
