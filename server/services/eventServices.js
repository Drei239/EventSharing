const asyncHandler = require('express-async-handler');
const eventModel = require('../models/eventModel');
const eventValidators = require('../validators/eventValidators');
const { eventError, eventSucc } = require('../validators/responsiveMessages');

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
    .find({ status: 'Public' })
    .populate('category')
    .populate('creator');
  if (events && events.length > 0) {
    return events;
  } else {
    throw Error(eventError.ERR_2);
  }
});

const getEventsFilter = asyncHandler(async (req, res) => {
  console.log(req);
  const { keyWord } = req.query;
  const queryObj = { ...req.query };
  try {
    const excludeField = ['page', 'sort', 'limit', 'search'];
    excludeField.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt,gte,lte,lt)\b/g, (match) => `$${match}`);
    let query;
    if (keyWord !== '' && search) {
      const queryObj = Object.assign(
        {
          $or: [
            { title: { $regex: keyWord, $options: 'i' } },
            { 'creator.name': { $regex: keyWord, $options: 'i' } },
          ],
        },
        JSON.parse(queryStr)
      );
      query = eventModel
        .find(queryObj)
        .populate('creator')
        .exec((err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            return;
          }
        });
    } else {
      query = eventModel.find(JSON.parse(queryStr));
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (Number(page) - 1) * limit;
    const eventCount = await Product.countDocuments();
    const events = await query;
    return events;
  } catch (err) {
    console.log(err);
    throw Error(eventError.ERR_2);
  }
});
//5.UPDATE EVENT
//CHO PHÉP NTCSK CẬP NHẬT THÔNG TIN SỰ KIỆN KHI VẪN CÒN LÀ BẢN NHÁP (STATUS = "DRAFT")
const updateEvent = asyncHandler(async (findById, title, description) => {
  const updateEvent = await eventModel.findOne({ _id: findById });
  if (updateEvent) {
    updateEvent.title = title || updateEvent.title;
    updateEvent.description = description || updateEvent.description;
    const updatedEvent = await updateEvent.save();
    return updatedEvent;
  } else {
    return false;
  }
});
module.exports = { createNewEvent, getPublicEvents, updateEvent };
