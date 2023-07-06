const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventValidators = require("../validators/eventValidators");
const { eventError, eventSucc } = require("../validators/responsiveMessages");
const orderModel = require("../models/orderModel");
const sendEmail = require("../utils/sendEmail");
const dayjs = require("dayjs");
const ejs = require("ejs");
const fs = require("fs");

//1.CREATE NEW EVENT
const emailTemplate = fs.readFileSync("./views/index.ejs", "utf-8");

const createNewEvent = asyncHandler(
  async (
    title,
    description,
    banner,
    imageList,
    category,
    isOnline,
    linkOnline,
    fee,
    location,
    timeEndSignup,
    timeBegin,
    timeEnd,
    creator,
    limitUser,
    reviews,
    status
  ) => {
    const existEvent = await eventModel.findOne({ title: title })
      .collation({ locale: "en", strength: 2 });
    if (!existEvent) {
      if (eventValidators.inputTimeValidation(timeEndSignup, timeBegin, timeEnd)) {
        const newEvent = await eventModel.create({
          title,
          description,
          banner,
          imageList,
          category,
          isOnline,
          linkOnline,
          fee,
          location,
          timeEndSignup,
          timeBegin,
          timeEnd,
          creator,
          limitUser,
          reviews,
          status,
        });
        if (newEvent) {
          return newEvent;
        } else {
          throw Error(eventError.ERR_1);
        }
      } else {
        throw Error(eventError.ERR_4);
      }
    } else {
      throw Error(eventError.ERR_5);
    }
  }
);

//2.GET ALL EVENT - CHỈ HIỂN THỊ CÁC EVENT ĐANG CÓ STATUS PUBLIC
//"$and"[{ "status": "Draft" }, { "status": "Public" }]
//DANH SÁCH THEO EVENT RATING GIẢM DẦN find().sort({eventRating:-1}).limit(1)
//EVENT RATING TĂNG DẦN find().sort({eventRating:+1}).limit(1)
const getPublicEvents = asyncHandler(async (req, res) => {
  const events = await eventModel
    .find({ status: "Public" })
    .populate("category")
    .populate("creator");
  if (events && events.length > 0) {
    return events;
  } else {
    throw Error(eventError.ERR_2);
  }
});

const getEventsFilter = asyncHandler(async (queryObj, queryKey) => {
  let queryObj2 = queryObj;

  const excludeField = ["page", "sort", "limit", "keyword"];
  // loc tu khoa
  excludeField.forEach((el) => delete queryObj2[el]);
  let queryStr = JSON.stringify(queryObj2);
  // thay cac gia tri cua tu khoa

  queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);
  queryStr = JSON.parse(queryStr);
  if (queryStr.isOnline == "true" || queryStr.isOnline == "false") {
    queryStr.isOnline = queryStr.isOnline === "true";
  }
  let query;
  console.log(queryStr);
  if (queryKey.keyword !== "" && queryKey.keyword) {
    const queryObj = await Object.assign(
      {
        $or: [
          { title: { $regex: queryKey.keyword, $options: "i" } },
          { "location.province": { $regex: queryKey.keyword, $options: "i" } },
        ],
      },
      { status: "Public" },
      queryStr
    );
    query = eventModel.find(queryObj);
  } else {
    query = eventModel.find(Object.assign({ status: "Public" }, queryStr));
  }
  if (queryKey.sort) {
    const sortBy = queryKey.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  const countryQuery = query.model.countDocuments(query.getFilter());
  const totalCount = await countryQuery.exec();
  const limit = queryKey.limit || 10;
  const page = queryKey.page || 1;
  const skip = (Number(page) - 1) * limit;
  query = query.skip(skip).limit(limit).populate("creator category").exec();

  // const eventCount=await eventModel.countDocuments();

  const events = await query;
  return { events, totalCount };
  // if (!events) {
  //   throw Error(eventError.ERR_2);
  // }
});

//5.UPDATE EVENT
//CHO PHÉP NTCSK CẬP NHẬT THÔNG TIN SỰ KIỆN KHI VẪN CÒN LÀ BẢN NHÁP (STATUS = "DRAFT")
//SAU KHI CÓ ĐĂNG NHẬP THÌ CẦN KIỂM TRA REQUEST USER ID = CREATOR MỚI CHO PHÉP UPDATE
//NHẬN OBJECT
const updateDraftEventInfo = asyncHandler(
  async (
    requestEventId,
    requestUserId,
    title,
    description,
    banner,
    imageList,
    category,
    isOnline,
    fee,
    location,
    linkOnline,
    timeEndSignup,
    timeBegin,
    timeEnd,
    limitUser,
    status
  ) => {
    const updateEvent = await eventModel.findOne({ _id: requestEventId });
    if (updateEvent) {
      if (updateEvent.creator.toString() === requestUserId.toString()) {
        if (updateEvent.status === "draft") {
          updateEvent.title = title || updateEvent.title;
          updateEvent.description = description || updateEvent.description;
          updateEvent.banner = banner || updateEvent.banner;
          updateEvent.imageList = imageList || updateEvent.imageList;
          updateEvent.category = category || updateEvent.category;
          updateEvent.isOnline = isOnline || updateEvent.isOnline;
          updateEvent.fee = fee || updateEvent.fee;
          updateEvent.location = location || updateEvent.location;
          updateEvent.timeEndSignup = timeEndSignup || updateEvent.timeEndSignup;
          updateEvent.timeBegin = timeBegin || updateEvent.timeBegin;
          updateEvent.timeEnd = timeEnd || updateEvent.timeEnd;
          updateEvent.limitUser = limitUser || updateEvent.limitUser;
          updateEvent.linkOnline = linkOnline || updateEvent.linkOnline;

          const existEvent = await eventModel.findOne({
            title: updateEvent.title,
          }).collation({ locale: "en", strength: 2 });
          if (eventValidators.inputTitleValidation(existEvent, requestEventId)) {
            if (
              eventValidators.inputTimeValidation(
                timeEndSignup,
                timeBegin,
                timeEnd
              )
            ) {
              const updatedEvent = await updateEvent.save();
              return updatedEvent;
            } else {
              throw Error(eventError.ERR_4);
            }
          } else {
            throw Error(eventError.ERR_5);
          }
        } else {
          throw Error(eventError.ERR_3);
        }
      } else {
        throw Error(eventError.ERR_8);
      }
    } else {
      throw Error(eventError.ERR_2);
    }
  }
);

const attendedEvent = async (id) => {
  const event = await orderModel
    .find({ user: id, isJoined: true })
    .populate("event user");
  return event;
};

const registeredEvent = async (id) => {
  const event = await orderModel
    .find({ user: id.toString(), isPaid: true, isJoined: false })
    .populate("event user");
  return event;
};

const getAllEventOfUser = async (id, status, keyword) => {
  if (keyword) {
    let findObject = {
      creator: id,
      title: { $regex: keyword, $options: "i" },
    };
    if (status || status !== "") {
      findObject = Object.assign(findObject, { status: status });
    }
    return await eventModel.find(findObject);
  }
  let findObject = { creator: id };
  if (status || status !== "") {
    findObject = Object.assign(findObject, { status: status });
  }
  return await eventModel.find(findObject);
};
//9.CREATE NEW REVIEW FOR EVENT & UPDATE TOTAL RATING
const createNewReview = asyncHandler(
  async (requestUserId, requestEventId, title, image, comment, rating) => {
    const orderedEvent = await orderModel.findOne({
      event: requestEventId,
      user: requestUserId,
    });
    const reviewdEvent = await eventModel.findOne({
      _id: requestEventId,
      "reviews.user": requestUserId,
    });
    //KIỂM TRA ĐÃ ĐĂNG KÝ SỰ KIỆN VÀ ĐÃ THAM GIA
    if (orderedEvent && orderedEvent.isJoined === true) {
      //KIỂM TRA ĐÃ REVIEW SỰ KIỆN?
      if (!reviewdEvent) {
        const eventReview = await eventModel.findOne({ _id: requestEventId });
        eventReview.reviews.push({
          title: title,
          image: image,
          comment: comment,
          rating: rating,
          user: requestUserId.toString(),
        });
        const eventRatingNum = eventReview.reviews.reduce(
          (accumulator, object) => {
            return accumulator + object.rating;
          },
          0
        );
        eventReview.eventRating = eventRatingNum / eventReview.reviews.length;
        await eventReview.save();
        return eventReview;
      } else {
        throw Error(eventError.ERR_6);
      }
    } else {
      throw Error(eventError.ERR_7);
    }
  }
);

//DELETE EVENT
const removeEventDraft = async (eventId, userId) => {
  const requestEvent = await eventModel.findById(eventId);
  if (!requestEvent) {
    throw Error(eventError.ERR_2);
  }

  if (requestEvent.creator != userId.toString()) {
    throw Error(eventError.ERR_8);
  }
  if (requestEvent.status !== "draft") {
    throw Error(eventError.ERR_9);
  }
  await eventModel.findOneAndDelete({ _id: eventId, creator: userId });
  return;
};

const cancelEvent = async (eventId, userId) => {
  const requestEvent = await eventModel.findById(eventId);
  if (!requestEvent) {
    throw Error(eventError.ERR_2);
  }
  if (requestEvent.creator != userId.toString()) {
    throw Error(eventError.ERR_8);
  }
  if (requestEvent.status !== "Public") {
    throw Error(eventError.ERR_10);
  }
  requestEvent.status = "Canceled";
  await requestEvent.save();
  const findOrderByEvent = await orderModel.find({ event: eventId });
  if (findOrderByEvent) {
    await Promise.all(
      findOrderByEvent.map(async (order) => {
        const renderedTemplate = await ejs.render(emailTemplate, {
          title: order.event.title,
          img: order.event.banner,
          time: `${dayjs(order.event.timeBegin).format(
            "ddd,DD MM YYYY hh:mm "
          )}-${dayjs(order.event.timeEnd).format("ddd,DD MM YYYY hh:mm ")}`,
          location: `${order.event.location.address} ${order.event.location.ward.name} ${order.event.location.district.name} ${order.event.location.province.name}`,
          content: "Đơn hàng của bạn sẽ được hoàn tiền",
          isOnline: order.event.isOnline,
          linkOnline: "da",
        });
        await sendEmail({
          to: order.user.email,
          subject: `${order.event.title} đã bị huỷ`,
          content: renderedTemplate,
        });
      })
    );
  }

  return requestEvent;
};

const confirmEventCompleted = async (eventId, userId) => {
  const requestEvent = await eventModel.findById(eventId);
  if (!requestEvent) {
    throw Error(eventError.ERR_2);
  }
  if (requestEvent.creator != userId.toString()) {
    throw Error(eventError.ERR_8);
  }
  if (
    requestEvent.status != "Public" ||
    Date.parse(requestEvent.timeBegin) >= Date.now()
  ) {
    throw Error(eventError.ERR_10);
  }
  requestEvent.status = "Completed";
  await requestEvent.save();
};
const changeStatusPublic = asyncHandler(
  async (
    eventId,
    title,
    description,
    banner,
    imageList,
    category,
    isOnline,
    linkOnline,
    fee,
    location,
    timeEndSignup,
    timeBegin,
    timeEnd,
    creator,
    limitUser,
    reviews,
    status
  ) => {
    const newEvent = await eventModel.findByIdAndUpdate(eventId, {
      title,
      description,
      banner,
      imageList,
      category,
      isOnline,
      linkOnline,
      fee,
      location,
      timeEndSignup,
      timeBegin,
      timeEnd,
      creator,
      limitUser,
      reviews,
      status: "Public",
    });
    if (newEvent) {
      return newEvent;
    } else {
      throw Error(eventError.ERR_1);
    }
  }
);
module.exports = {
  createNewEvent,
  getPublicEvents,
  updateDraftEventInfo,
  getEventsFilter,
  attendedEvent,
  registeredEvent,
  getAllEventOfUser,
  createNewReview,
  cancelEvent,
  removeEventDraft,
  confirmEventCompleted,
  changeStatusPublic,
};
