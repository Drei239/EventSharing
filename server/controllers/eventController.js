const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventService = require("../services/eventServices");
const { eventError, eventSucc } = require("../validators/responsiveMessages");
const orderModel = require("../models/orderModel");
const eventValidators = require("../validators/eventValidators");

//UPDATE CREATE REVIEW EVENT - UPDATE EVENT RATING - PROTECT UPDATE DRAFT EVENT
//Lưu data theo UTC time
//Tìm cách lấy client timezone convert cho ra giờ theo timezone của họ
function changeTimeZone(date, timeZone) {
  if (typeof date === "string") {
    return new Date(
      new Date(date).toLocaleString("en-US", {
        timeZone,
      })
    );
  }

  return new Date(
    date.toLocaleString("en-US", {
      timeZone,
    })
  );
}

const date = new Date();
console.log("new Date", date);

const hcmDate = changeTimeZone(date, "Asia/Saigon");
console.log("Asia/Saigon Date", hcmDate);

console.log(
  "toLocaleString Date",
  date.toLocaleString("en-US", {
    timeZone: "Asia/Saigon",
  })
);

//1.CREATE NEW EVENT
const createNewEvent = asyncHandler(async (req, res) => {
  const {
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
    reviews,
    status,
  } = req.body;
  try {
    const newEvent = await eventService.createNewEvent(
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
      req.user?._id,
      limitUser,
      reviews,
      status
    );
    console.log(newEvent);
    return res
      .status(200)
      .json({ status: 200, data: newEvent, message: eventSucc.SUC_1 });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
});

//2.GET ALL PUBLIC EVENT - CHỈ HIỂN THỊ CÁC EVENT ĐANG CÓ STATUS PUBLIC
//"$and"[{ "status": "Draft" }, { "status": "Public" }]
//DANH SÁCH THEO EVENT RATING GIẢM DẦN find().sort({eventRating:-1}).limit(1)
//EVENT RATING TĂNG DẦN find().sort({eventRating:+1}).limit(1)
// const getPublicEvent = asyncHandler(async (req, res) => {
//     const events = await eventModel.find({ "status": "Public" });
//     if (events) {
//         console.log(events[0].timeBegin.toLocaleString('en-US', {
//             timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//         }),);
//         res.status(200).json(events);
//     } else {
//         res.status(401);
//         throw new Error("KHÔNG TÌM THẤY BẤT CỨ EVENT NÀO!");
//     }
// });

const getPublicEvents = asyncHandler(async (req, res) => {
  try {
    const events = await eventService.getPublicEvents();
    return res
      .status(200)
      .json({ status: 200, data: events, message: eventSucc.SUC_2 });
  } catch (error) {
    return res.status(400).json({ status: 400, message: eventError.ERR_2 });
  }
});
// search by title + filter
const getFilterEvents = asyncHandler(async (req, res) => {
  const query = req.query;
  const queryObj = { ...req.query };
  try {
    const data = await eventService.getEventsFilter(queryObj, query);

    return res.status(200).json({
      status: 200,
      data: data.events,
      totalCount: data.totalCount,
      message: eventError.ERR_2,
    });
  } catch (err) {
    throw Error(err);
  }
});
// function getPublicEvent() {
//     eventService.getPublicEvent();
// }

//HOT EVENTS
const highlightEvents = asyncHandler(async (req, res) => {
  try {
    const events = await eventModel
      .find({
        timeEndSignup: { $gte: Date.now() },
        status: "Public",
      })
      .populate({ path: "creator", options: { sort: { userRating: -1 } } })
      .populate("category")
      .limit(5);

    return res
      .status(200)
      .json({ status: 200, data: events, message: eventSucc.SUC_2 });
  } catch (err) {
    throw Error(err);
  }
});

//3.GET INFO EVENT BY ID
const getEventById = asyncHandler(async (req, res) => {
  const event = await eventModel
    .findById(req.params.id)
    .populate("category")
    .populate("creator", "_id name avatar totalRating")
    .populate("reviews.user", "name avatar");
  if (event) {
    if (event.status === "draft") {
      if (!req.user || req.user._id !== event.creator._id) {
        throw Error("Bạn không có quyền vào trang này");
      } else {
        res.status(200).json(event);
      }
    } else {
      res.status(200).json(event);
    }
  } else {
    res.status(401);
    throw new Error("KHÔNG TÌM THẤY EVENT!");
  }
});

//4.GET EVENT BY CREATOR
//CẦN KIỂM TRA REQUEST USER = CREATOR OR GUEST ĐỂ PHÂN LOẠI HIỂN THỊ
//STATUS = "?" DRAFT PENDING PUBLIC COMPLETED CANCELED
const getEventByCreator = asyncHandler(async (req, res) => {
  const event = await eventModel.find({ creator: req.params.id });
  if (event) {
    res.status(200).json(event);
  } else {
    res.status(401);
    throw new Error("KHÔNG TÌM THẤY EVENT CỦA NGƯỜI DÙNG!");
  }
});

//5.UPDATE EVENT
//CHO PHÉP NTCSK CẬP NHẬT THÔNG TIN SỰ KIỆN KHI VẪN CÒN LÀ BẢN NHÁP (STATUS = "DRAFT")
//CHO PHÉP ADMIN PHÊ DUYỆT HIỂN THỊ SỰ KIỆN (STATUS = "PENDING" => "PUBLIC")
//TRUYỀN XUỐNG 1 OBJECT
const updateDraftEventInfo = asyncHandler(async (req, res) => {
  const requestEventId = req.params.id;
  const requestUserId = req.user._id;
  const {
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
    status,
  } = req.body;
  console.log(description);
  try {
    const updateEvent = await eventService.updateDraftEventInfo(
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
    );
    res
      .status(200)
      .json({ status: 200, data: updateEvent, message: eventSucc.SUC_6 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 400, message: error.message });
  }
});

//6.FIND EVENT BY TITLE - USE PARAMS
const getEventByTitle = asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  const searchQuery = { title: { $regex: keyword } };
  const searchedEvent = await eventModel.find({ ...searchQuery });
  if (searchedEvent) {
    res.status(200).json(searchedEvent);
  } else {
    res.status(401);
    throw new Error("KHÔNG TÌM THẤY SỰ KIỆN!");
  }
});

//7.GET EVENTS BY QUERY - USE QUERY
const getQueryEvents = asyncHandler(async (req, res) => {
  const reqIsOnline = req.query.isOnline;
  const searchQuery = reqIsOnline ? { isOnline: reqIsOnline } : {};
  const searchedEvent = await eventModel.find({ ...searchQuery });
  if (searchedEvent) {
    res.status(200).json(searchedEvent);
  } else {
    res.status(401);
    throw new Error("KHÔNG TÌM THẤY SỰ KIỆN!");
  }
});

//8.GET
const getJoinedEvent = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  try {
    const events = await eventService.attendedEvent(id);
    res
      .status(200)
      .json({ status: 200, message: eventSucc.SUC_3, data: events });
  } catch (err) {
    next(err);
  }
});
const getRegisteredEvent = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  try {
    const events = await eventService.registeredEvent(id);
    res
      .status(200)
      .json({ status: 200, message: eventSucc.SUC_3, data: events });
  } catch (err) {
    next(err);
  }
});
const getAllEventOfUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const { event, countDocument } = await eventService.getAllEventOfUser(
      id,
      req.query
    );
    res
      .status(200)
      .json({
        status: 200,
        data: event,
        message: eventSucc.SUC_3,
        countDocument: countDocument,
      });
  } catch (err) {
    next(err);
  }
});

//9.CREATE NEW REVIEW FOR EVENT & UPDATE TOTAL RATING
const createNewReview = asyncHandler(async (req, res) => {
  const requestUserId = req.user._id;
  const requestEventId = req.params.id;
  const { title, image, comment, rating } = req.body;
  try {
    const review = await eventService.createNewReview(
      requestUserId,
      requestEventId,
      title,
      image,
      comment,
      rating
    );
    res
      .status(200)
      .json({ status: 200, data: review, message: eventSucc.SUC_5 });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

const getEventsOrganizers = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await eventModel.find({ creator: id });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400);
    throw new Error("Not found");
  }
});

const removeEventDraft = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user?._id;
  try {
    const event = await eventService.removeEventDraft(eventId, userId);
    res
      .status(200)
      .json({ status: 200, message: eventSucc.SUC_6, data: event });
  } catch (err) {
    next(err);
  }
});
const cancelEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  try {
    await eventService.cancelEvent(eventId, userId);
    res.status(200).json({ status: 200, message: eventSucc.SUC_7 });
  } catch (err) {
    next(err);
  }
});
const confirmEventCompleted = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  try {
    await eventService.confirmEventCompleted(eventId, userId);
    res.status(200).json({ status: 200, message: eventSucc.SUC_7 });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
const changeStatusPublic = asyncHandler(async (req, res, next) => {
  const {
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
    reviews,
    status,
  } = req.body;
  const eventId = req.params.id;
  console.log(req.body);
  // Sau khi gán userInfo = req.user
  // const creator = req.user._id;
  // loại bỏ giá trị creator ở req.body
  // if (inputTimeValidation(timeEndSignup, timeBegin, timeEnd)) {
  try {
    const newEvent = await eventService.changeStatusPublic(
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
      req.user?._id,
      limitUser,
      reviews,
      status
    );
    return res
      .status(200)
      .json({ status: 200, data: newEvent, message: eventSucc.SUC_1 });
  } catch (error) {
    // return res.status(400).json({ status: 400, message: eventError.ERR_1 });
    console.log(error);
    next(error);
  }
});

module.exports = {
  createNewEvent,
  getPublicEvents,
  getEventById,
  getEventByCreator,
  updateDraftEventInfo,
  getEventByTitle,
  getQueryEvents,
  getFilterEvents,
  highlightEvents,
  getJoinedEvent,
  getRegisteredEvent,
  getAllEventOfUser,
  createNewReview,
  getEventsOrganizers,
  cancelEvent,
  removeEventDraft,
  confirmEventCompleted,
  changeStatusPublic,
};
