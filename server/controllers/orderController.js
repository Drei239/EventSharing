const asyncHandler = require("express-async-handler");
const orderModel = require("../models/orderModel");
const orderService = require("../services/orderServices");
const resMes = require("../validators/responsiveMessages");

//1.CREATE NEW ORDER
const createNewOrder = asyncHandler(async (req, res) => {
  //SAU KHI LOGIN USER = REQUEST USER ID
  const { event } = req.body;
  const user = req.user._id;
  try {
    const newOrder = await orderService.createNewOrder(event, user);
    return res
      .status(200)
      .json({ status: 200, data: newOrder, message: resMes.orderSucc.SUCC_1 });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
});

//2.GET ALL ORDER OF EVENT BY ID
const getOrdersByEventId = asyncHandler(async (req, res) => {
  const requestEvent = req.params.id;
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const keyword = req.query.keyword || "";
    const sort = req.query.sort || "-createdAt";
    const status = req.query.status || "all";
    const orders = await orderService.getOrdersByEventId({
      requestEvent,
      page,
      limit,
      keyword: req.query.keyword,
      sort: sort,
      status: status,
    });
    return res.status(200).json({
      status: 200,
      data: orders.data,
      countDocument: orders.countDocument,
      message: resMes.orderSucc.SUCC_2,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
});
const updateOdrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { isPaid, isRefund, isJoined } = req.body;
  const creatorId = req.user._id;
  try {
    const Order = await orderService.updateOrder({
      orderId: id,
      creatorId,
      data: { isPaid, isRefund, isJoined },
    });
    res
      .status(200)
      .json({ status: 200, message: resMes.orderSucc.SUCC_3, data: Order });
  } catch (err) {
    next(err);
  }
});
module.exports = {
  createNewOrder,
  getOrdersByEventId,
  updateOdrder,
};
