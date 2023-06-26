const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventValidators = require("../validators/eventValidators");
const { eventError, eventSucc } = require("../validators/responsiveMessages");
const orderModel = require("../models/orderModel");

//1.CREATE NEW EVENT
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
    console.log(newEvent);
    if (newEvent) {
      return newEvent;
    } else {
      throw Error(eventError.ERR_1);
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
    requestId,
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
    limitUser
  ) => {
    const updateEvent = await eventModel.findOne({ _id: requestId });
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

      const existEvent = await eventModel.findOne({ title: updateEvent.title });
      if (eventValidators.inputTitleValidation(existEvent, requestId)) {
        if (
          eventValidators.inputTimeValidation(
            updateEvent.timeEndSignup,
            updateEvent.timeBegin,
            updateEvent.timeEnd
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
    .find({ user: id.toString(), isPaid: true })
    .populate("event user");
  return event;
};
const getAllEventOfUser = async (id, status, keyword) => {
  switch (status) {
    case "public": {
      if (keyword) {
        return await eventModel.find({
          creator: id,
          status: "Public",
          title: { $regex: keyword, $options: "i" },
        });
      }

      return await eventModel.find({ creator: id, status: "Public" });
    }
    case "draft": {
      if (keyword) {
        return await eventModel.find({
          creator: id,
          status: "draft",
          title: { $regex: keyword, $options: "i" },
        });
      }
      return await eventModel.find({ creator: id, status: "draft" });
    }
    case "completed": {
      if (keyword) {
        return await eventModel.find({
          creator: id,
          timeEnd: { $lte: new Date() },
          title: { $regex: keyword, $options: "i" },
        });
      }
      return await eventModel.find({
        creator: id,
        timeEnd: { $lte: new Date() },
      });
    }
    default:
      if (keyword) {
        return await eventModel.find({
          creator: id,
          title: { $regex: keyword, $options: "i" },
        });
      }
      return await eventModel.find({ creator: id });
  }
};
module.exports = {
  createNewEvent,
  getPublicEvents,
  updateDraftEventInfo,
  getEventsFilter,
  attendedEvent,
  registeredEvent,
  getAllEventOfUser,
};
