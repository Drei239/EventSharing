const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventService = require("../services/eventServices");
const { eventError, eventSucc } = require("../validators/responsiveMessages");
const orderModel = require("../models/orderModel");
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

function inputTimeValidation(timeEndSignup, timeBegin, timeEnd) {
  if (
    Date.parse(timeEndSignup) < Date.parse(timeBegin) &&
    Date.parse(timeEndSignup) < Date.parse(timeEnd) &&
    Date.parse(timeBegin) < Date.parse(timeEnd)
  ) {
    return true;
  } else {
    return false;
  }
}

//1.CREATE NEW EVENT
const createNewEvent = asyncHandler(async (req, res, next) => {
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

  // Sau khi gán userInfo = req.user
  // const creator = req.user.id;
  // loại bỏ giá trị creator ở req.body
  console.log(inputTimeValidation(timeEndSignup, timeBegin, timeEnd));
  if (inputTimeValidation(timeEndSignup, timeBegin, timeEnd)) {
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
        req.user._id,
        limitUser,
        reviews,
        status
      );
      return res
        .status(200)
        .json({ status: 200, data: newEvent, message: eventSucc.SUC_1 });
    } catch (error) {
      // return res.status(400).json({ status: 400, message: eventError.ERR_1 });
      next(error);
    }
  } else {
    res.status(401);
    throw new Error("CREATE NEW EVENT FAILED!");
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
    console.log("a");
    const events = await eventModel
      .find({
        timeEndSignup: { $gte: Date.now() },
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
    .find({ _id: req.params.id })
    .populate("category")
    .populate("creator", "_id name avatar totalRating");
  if (event) {
    res.status(200).json(event);
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
  const requestId = req.params.id;
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
  } = req.body;
  const updateEvent = await eventService.updateDraftEventInfo(
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
  );
  if (updateEvent) {
    res.status(200).json(updateEvent);
  } else {
    res.status(401);
    throw new Error("UPDATE EVENT FAILED!");
  }
});

// const updateEvent = asyncHandler(async (req, res) => {
//     const findId = req.params.id;
//     const { title, description } = req.body;
//     const updateEvent = await eventModel.findOne({ _id: findId, "status": "Draft" });
//     if (updateEvent) {
//         updateEvent.title = title || updateEvent.title;
//         updateEvent.description = description || updateEvent.description;
//         const updatedEvent = await updateEvent.save();
//         res.status(200).json(updatedEvent);
//         return (updatedEvent);
//     } else {
//         res.status(401);
//         throw new Error("UPDATE EVENT FAILED!");
//     }
// });

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
  const { status, keyword } = req.query;
  try {
    const events = await eventService.getAllEventOfUser(id, status, keyword);
    res
      .status(200)
      .json({ status: 200, data: events, message: eventSucc.SUC_3 });
  } catch (err) {
    next(err);
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
};
