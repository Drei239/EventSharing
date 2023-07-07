const asyncHandler = require("express-async-handler");
const orderModel = require("../models/orderModel");
const orderService = require("../services/orderServices");
const resMes = require("../validators/responsiveMessages");
const excelJs = require("exceljs");

//1.CREATE NEW ORDER
const createNewOrder = asyncHandler(async (req, res) => {
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
      keyword: keyword,
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
  const creatorId = req.user._id;
  try {
    const Order = await orderService.updateOrder({
      orderId: id,
      creatorId,
      status: req.query.status,
    });
    res
      .status(200)
      .json({ status: 200, message: resMes.orderSucc.SUCC_3, data: Order });
  } catch (err) {
    next(err);
  }
});

//3.PUT - UPDATE ALL ORDER
const updateAllByEventId = asyncHandler(async (req, res) => {
  const requestUserId = req.user._id;
  const requestEventId = req.params.id;
  const { isPaid, isRefund, isJoined } = req.body;
  try {
    const orders = await orderService.updateAllByEventId(
      requestUserId,
      requestEventId,
      isPaid,
      isRefund,
      isJoined
    );
    return res
      .status(200)
      .json({ status: 200, data: orders, message: resMes.orderSucc.SUCC_3 });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
});

//4.PUT - UPDATE REQUEST ORDERS
const updateRequestOrder = asyncHandler(async (req, res) => {
  const requestUserId = req.user._id;
  const requestEventId = req.params.id;
  const updateData = req.body;
  try {
    const orders = await orderService.updateRequestOrder(
      requestUserId,
      requestEventId,
      updateData
    );
    return res
      .status(200)
      .json({ status: 200, data: orders, message: resMes.orderSucc.SUCC_3 });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
});

//5.EXPORT ORDERS TO EXCEL
const exportData = asyncHandler(async (req, res) => {
  const requestUserId = req.user._id;
  const requestEventId = req.params.id;
  const workbook = new excelJs.Workbook();
  try {
    const exportData = await orderService.exportData(
      requestUserId,
      requestEventId,
      workbook
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=orders.xlsx`);
    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, message: error.message });
  }
});

const sendEmailtoId = asyncHandler(async (req, res, next) => {
  const { content, subject, ordersId } = req.body;
  try {
    await orderService.sendEmailtoId({
      subject,
      content,
      ordersId: ordersId,
      creatorId: req.user._id,
    });
    res.status(200).json({ status: 200, message: "send email success" });
  } catch (err) {
    next(err);
  }
});
const sendEmailAllOrder = asyncHandler(async (req, res, next) => {
  const { content, subject, eventId } = req.body;
  try {
    await orderService.sendEmailAllOrder({
      content,
      subject,
      eventId,
      creatorId: req.user._id,
    });
    res.status(200).json({ status: 200, message: "send email success" });
  } catch (err) {
    next(err);
  }
});

const getOrdersByUserId = asyncHandler(async (req, res) => {
  const orderList = await orderModel
    .find({ user: req.user._id })
    .populate("event");
  if (orderList) {
    res.status(200).json(orderList);
  } else {
    res.status(400);
    throw new Error("Fail");
  }
});

module.exports = {
  createNewOrder,
  getOrdersByEventId,
  updateOdrder,
  updateAllByEventId,
  updateRequestOrder,
  sendEmailtoId,
  sendEmailAllOrder,
  exportData,
  getOrdersByUserId,
};
