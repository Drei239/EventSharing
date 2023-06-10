const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventValidators = require("../validators/eventValidators");
const { eventError, eventSucc } = require("../validators/responsiveMessages");


//2.GET ALL EVENT - CHỈ HIỂN THỊ CÁC EVENT ĐANG CÓ STATUS PUBLIC
//"$and"[{ "status": "Draft" }, { "status": "Public" }]
//DANH SÁCH THEO EVENT RATING GIẢM DẦN find().sort({eventRating:-1}).limit(1)
//EVENT RATING TĂNG DẦN find().sort({eventRating:+1}).limit(1)
const getPublicEvents = asyncHandler(async (req, res) => {
    const events = await eventModel.find({ "status": "Public" });
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

module.exports = { getPublicEvents, updateEvent };