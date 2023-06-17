const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventValidators = require("../validators/eventValidators");
const { eventError, eventSucc } = require("../validators/responsiveMessages");

//1.CREATE NEW EVENT
const createNewEvent = asyncHandler(
  async (
    title,
    description,
    banner,
    imageList,
    category,
    isOnline,
    fee,
    location,
    timeEndSignup,
    timeBegin,
    timeEnd,
    creator,
    limitUser,
    reviews
  ) => {
    const newEvent = await eventModel.create({
      title,
      description,
      banner,
      imageList,
      category,
      isOnline,
      fee,
      location,
      timeEndSignup,
      timeBegin,
      timeEnd,
      creator,
      limitUser,
      reviews,
    });
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
    const queryObj = Object.assign(
      {
        $or: [
          { title: { $regex: queryKey.keyword, $options: "i" } },
          { location: { $regex: queryKey.keyword, $options: "i" } },
        ],
      },
      queryStr
    );
    query = eventModel.find(queryObj);
  } else {
    query = eventModel.find(queryStr);
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
const updateEvent = asyncHandler(
  async (findById, title, description, location) => {
    const updateEvent = await eventModel.findOne({ _id: findById });
    if (updateEvent) {
      updateEvent.title = title || updateEvent.title;
      updateEvent.description = description || updateEvent.description;
      updateEvent.location = location || updateEvent.location;
      const updatedEvent = await updateEvent.save();
      return updatedEvent;
    } else {
      return false;
    }
  }
);
module.exports = {
  createNewEvent,
  getPublicEvents,
  updateEvent,
  getEventsFilter,
};
