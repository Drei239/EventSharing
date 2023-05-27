const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");

//1.CREATE NEW EVENT
const createNewEvent = asyncHandler(async (req, res) => {
    const { title, description, banner, imageList,
        category, type, fee, location,
        timeEndSignup, timeBegin, timeEnd, creator,
        limitUser, reviews } = req.body;
    // Sau khi gán userInfo = req.user 
    // const creator = req.user.id;
    // loại bỏ giá trị creator ở req.body
    if (Date.parse(timeEndSignup) < Date.parse(timeBegin) &&
        Date.parse(timeEndSignup) < Date.parse(timeEnd) &&
        Date.parse(timeBegin) < Date.parse(timeEnd)) {
        const newEvent = await eventModel.create({
            title, description, banner, imageList,
            category, type, fee, location,
            timeEndSignup, timeBegin, timeEnd, creator,
            limitUser, reviews
        });
        if (newEvent) {
            res.status(200).json(newEvent);
        } else {
            res.status(401);
            throw new Error("CREATE NEW EVENT FAILED!");
        }
    } else {
        console.log("KIỂM TRA LẠI THỜI GIAN NHẬP VÀO!");
        throw new Error("KIỂM TRA LẠI THỜI GIAN NHẬP VÀO!");
    }
});

//2.GET ALL EVENT - CHỈ HIỂN THỊ CÁC EVENT ĐANG CÓ STATUS PUBLIC
//"$and"[{ "status": "Draft" }, { "status": "Public" }]
//DANH SÁCH THEO EVENT RATING GIẢM DẦN find().sort({eventRating:-1}).limit(1)
//EVENT RATING TĂNG DẦN find().sort({eventRating:+1}).limit(1)
const getAllEvent = asyncHandler(async (req, res) => {
    const events = await eventModel.find({ "status": "Public" });
    if (events) {
        res.status(200).json(events);
    } else {
        res.status(401);
        throw new Error("KHÔNG TÌM THẤY BẤT CỨ EVENT NÀO!");
    }
});

//3.GET INFO EVENT BY ID
const getEventById = asyncHandler(async (req, res) => {
    const event = await eventModel.find({ _id: req.params.id });
    if (event) {
        res.status(200).json({ event });
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
})

module.exports = {
    createNewEvent, getAllEvent,
    getEventById, getEventByCreator
}