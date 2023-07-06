const asyncHandler = require("express-async-handler");
const orderModel = require("../models/orderModel");
const eventModel = require("../models/eventModel");
const notifyModel = require("../models/notifyModel");
const orderValidator = require("../validators/orderValidators");
const eventValidator = require("../validators/eventValidators");
const resMes = require("../validators/responsiveMessages");
const sendEmail = require("../utils/sendEmail");

const dayjs = require("dayjs");
const ejs = require("ejs");
const fs = require("fs");

const emailTemplate = fs.readFileSync("./views/index.ejs", "utf-8");
//1.CREATE NEW ORDER
const createNewOrder = asyncHandler(async (event, user) => {
  const existOrder = await orderModel.findOne({
    event: event,
    user: user,
  });
  console.log(event);
  const eventOrder = await eventModel
    .findOne({ _id: event })
    .populate("creator");
  const listOrder = await orderModel.find({ event: event });
  if (eventOrder) {
    if (orderValidator.existOrderValidation(existOrder)) {
      if (orderValidator.limitUserValidation(eventOrder.limitUser, listOrder)) {
        if (Date.now() < eventOrder.timeEndSignup) {
          const newOrder = await orderModel.create({
            event,
            user,
          });
          if (newOrder) {
            const notify = await notifyModel.create({
              notifyFrom: user,
              notifyTo: eventOrder.creator._id,
              notifyType: "new-order",
              content: `đã đăng kí sự kiện của bạn`,
              eventId: newOrder.event,
            });
            return { newOrder, notify };
          } else {
            throw Error("ĐĂNG KÝ SỰ KIỆN THẤT BẠI!");
          }
        } else {
          throw Error(resMes.orderError.ERR_8);
        }
      } else {
        throw Error(resMes.orderError.ERR_2);
      }
    } else {
      throw Error(resMes.orderError.ERR_1);
    }
  } else {
    throw Error(resMes.eventError.ERR_2);
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
        if (updateOrder && updateOrder.matchedCount != 0) {
          if (
            updateData[0].isPaid === true &&
            updateData[0].isRefund === false &&
            updateData[0].isJoined === false
          )
            await Promise.all(
              updateData.map(async (data) => {
                const renderedTemplate = await ejs.render(emailTemplate, {
                  title: requestEvent.title,
                  img: requestEvent.banner,
                  time: `${dayjs(requestEvent.timeBegin).format(
                    "ddd,DD MM YYYY hh:mm "
                  )}-${dayjs(requestEvent.timeEnd).format(
                    "ddd,DD MM YYYY hh:mm "
                  )}`,
                  location: `${requestEvent.location.address} ${requestEvent.location.ward.name} ${requestEvent.location.district.name} ${requestEvent.location.province.name}`,
                  content: "Đơn hàng của bạn đã được xác nhận thanh toán",
                  isOnline: requestEvent.isOnline,
                  linkOnline: "das",
                });
                await sendEmail({
                  to: data.email,
                  subject: `Vé của bạn cho ${requestEvent.title} đã được xác nhận thanh toán`,
                  content: renderedTemplate,
                });
              })
            );
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

//5.EXPORT ORDERS TO EXCEL
const exportData = asyncHandler(
  async (requestUserId, requestEventId, workbook) => {
    const requestEvent = await eventModel.findOne({ _id: requestEventId });
    //EVENT TỒN TẠI?
    if (requestEvent) {
      const requestOrder = await orderModel
        .find({ event: requestEventId })
        .populate("event", "title")
        .populate("user", "name");
      //EVENT TỒN TẠI DANH SÁCH EVENT?
      if (orderValidator.eventExistOrderValidation(requestOrder)) {
        //NGƯỜI REQUEST LÀ CREATOR
        if (
          eventValidator.requestIsCreatorValidation(requestEvent, requestUserId)
        ) {
          const worksheet = workbook.addWorksheet("Orders");
          worksheet.columns = [
            { header: "Id No.", key: "id_No", width: 10 },
            { header: "Event", key: "event_Title", width: 40 },
            { header: "User", key: "user_Name", width: 40 },
            { header: "Paid", key: "isPaid", width: 10 },
            { header: "Refund", key: "isRefund", width: 10 },
            { header: "Joined", key: "isJoined", width: 10 },
            { header: "CreatedAt", key: "createdAt", width: 20 },
          ];

          let counter = 1;
          requestOrder.forEach((order) => {
            order.id_No = counter;
            order.event_Title = order.event.title;
            order.user_Name = order.user.name;
            worksheet.addRow(order);
            counter++;
          });

          worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
          });
        } else {
          throw Error(resMes.orderError.ERR_7);
        }
      } else {
        throw Error(resMes.orderError.ERR_3);
      }
    } else {
      throw Error(resMes.eventError.ERR_2);
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
      const renderedTemplate = await ejs.render(emailTemplate, {
        title: findOrder.event.title,
        img: findOrder.event.banner,
        time: `${dayjs(findOrder.event.timeBegin).format(
          "ddd,DD MM YYYY hh:mm "
        )}-${dayjs(findOrder.event.timeEnd).format("ddd,DD MM YYYY hh:mm ")}`,
        location: `${findOrder.event.location.address} ${findOrder.event.location.ward.name} ${findOrder.event.location.district.name} ${findOrder.event.location.province.name}`,
        content: "Đơn hàng của bạn đã được xác nhận thanh toán",
        isOnline: findOrder.event.isOnline,
        linkOnline: "das",
      });
      await sendEmail({
        to: findOrder.user.email,
        subject: `Vé của bạn cho ${findOrder.event.title} đã được xác nhận thanh toán`,
        content: renderedTemplate,
      });
      findOrder.isPaid = true;
      findOrder.isRefund = false;
      findOrder.isJoined = false;

      const findOrdered = await findOrder.save();
      return findOrdered;
    }
    case "unpaid": {
      findOrder.isPaid = false;
      findOrder.isRefund = false;
      findOrder.isJoined = false;
      const findOrdered = await findOrder.save();
      return findOrdered;
    }
    case "joined": {
      findOrder.isPaid = true;
      findOrder.isRefund = false;
      findOrder.isJoined = true;
      const findOrdered = await findOrder.save();
      return findOrdered;
    }
    case "refund": {
      if (findOrder.event.status !== "Canceled") {
        throw Error("Không thể chuyển status của đơn hàng này");
      }
      findOrder.isPaid = false;
      findOrder.isRefund = true;
      findOrder.isJoined = false;
      const findOrdered = await findOrder.save();
      return findOrdered;
    }
    default:
      findOrder.isPaid = false;
      findOrder.isRefund = false;
      findOrder.isJoined = false;
      const findOrdered = findOrder.save();
      return findOrdered;
  }
};

const sendEmailtoId = async ({ subject, content, ordersId, creatorId }) => {
  await Promise.all(
    ordersId.map(async (item, index) => {
      const order = await orderModel.findById(item).populate("user event");
      if (order.event.creator != creatorId.toString()) {
        throw Error(resMes.orderError.ERR_7);
      }
      const contents = `<div>
    <div style="display:flex;align-items:center;justify-content:center;width:600px;margin:0 auto;gap:30px; border-bottom:2px solid #ccc; padding:40px 0">
    <img src=${order.event.banner}  alt="" style="width:300px;height:300px " />
    <div>
    <h4 style="text-tranform:underline;color:blue;font-size:20px">${
      order.event.title
    }</h4>
    <p>${dayjs(order.event.timeBegin).format("ddd, DD MMM YYYY hh:mm")}</p>
    <p>${order.event.location.address} ${order.event.location.ward.name} ${
        order.event.location.district.name
      } ${order.event.location.province.name}</p>
    </div>
    </div>
   <div>${content}</div>
</div>`;
      await sendEmail({ subject, content: contents, to: order.user.email });
    })
  );
  return "sendEmailsuccess";
};
const sendEmailAllOrder = async ({ eventId, creatorId, content, subject }) => {
  const requestUser = await eventModel.findById(eventId);
  if (requestUser.creator != creatorId.toString()) {
    throw Error(resMes.orderError.ERR_6);
  }
  const orders = await orderModel
    .find({ event: eventId })
    .populate("user event");
  if (!orders) {
    throw Error(resMes.orderError.ERR_4);
  }
  await Promise.all(
    orders.map(async (order, index) => {
      const contents = `<div>
    <div style="display:flex;align-items:center;justify-content:center;width:600px;margin:0 auto">
    <img src=${order.event.banner}  alt="" style="width:100px;height:100px" />
    <div>
    <h4 style="text-tranform:underline;color:blue">${order.event.title}</h4>
    </div>
    </div>
   <div>${content}</div>
</div>`;
      await sendEmail({ subject, content: contents, to: order.user.email });
    })
  );
  return;
};
module.exports = {
  createNewOrder,
  getOrdersByEventId,
  updateOrder,
  updateAllByEventId,
  updateRequestOrder,
  sendEmailtoId,
  sendEmailAllOrder,
  exportData,
};
