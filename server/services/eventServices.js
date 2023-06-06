const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventValidators = require("../validators/eventValidators");

//2.GET ALL EVENT - CHỈ HIỂN THỊ CÁC EVENT ĐANG CÓ STATUS PUBLIC
//"$and"[{ "status": "Draft" }, { "status": "Public" }]
//DANH SÁCH THEO EVENT RATING GIẢM DẦN find().sort({eventRating:-1}).limit(1)
//EVENT RATING TĂNG DẦN find().sort({eventRating:+1}).limit(1)
const getPublicEvent = asyncHandler(async (req, res) => {
    const events = await eventModel.find({ "status": "Public" });
    if (events) {
        // console.log(events[0].timeBegin.toLocaleString('en-US', {
        //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        // }),);
        // console.log(events);
        // res.status(200).json(events);
        return events;

    } else {
        res.status(401);
        throw new Error("KHÔNG TÌM THẤY BẤT CỨ EVENT NÀO!");
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

module.exports = {getPublicEvent, updateEvent };