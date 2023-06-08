const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventValidators = require("../validators/eventValidators");
const { eventError, eventSucc } = require("../validators/responsiveMessages");

//1.CREATE NEW EVENT
const createNewEvent = asyncHandler(async (
    title, description, banner, imageList,
    category, isOnline, fee, location,
    timeEndSignup, timeBegin, timeEnd, creator,
    limitUser, reviews) => {
    const newEvent = await eventModel.create({
        title, description, banner, imageList,
        category, isOnline, fee, location,
        timeEndSignup, timeBegin, timeEnd, creator,
        limitUser, reviews
    });
    if (newEvent) {
        return newEvent;
    } else {
        throw Error(eventError.ERR_1);
    }
});

//2.GET ALL EVENT - CHỈ HIỂN THỊ CÁC EVENT ĐANG CÓ STATUS PUBLIC
//"$and"[{ "status": "Draft" }, { "status": "Public" }]
//DANH SÁCH THEO EVENT RATING GIẢM DẦN find().sort({eventRating:-1}).limit(1)
//EVENT RATING TĂNG DẦN find().sort({eventRating:+1}).limit(1)
const getPublicEvents = asyncHandler(async (req, res) => {
    const events = await eventModel.find({ "status": "Public" }).populate("category").populate("creator");
    if (events && events.length > 0) {
        return events;
    } else {
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
        return (updatedEvent);
    } else {
        return false;
    }
});

module.exports = { createNewEvent, getPublicEvents, updateEvent };