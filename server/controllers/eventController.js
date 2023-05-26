const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");

//1.CREATE NEW EVENT
const createNewEvent = asyncHandler(async (req, res) => {
    let { title, timeEndSignup, timeBegin, timeEnd } = req.body;
    if (Date.parse(timeEndSignup) < Date.parse(timeBegin) &&
        Date.parse(timeEndSignup) < Date.parse(timeEnd) &&
        Date.parse(timeBegin) < Date.parse(timeEnd)) {
        const event = await eventModel.create({
            title,
            timeEndSignup,
            timeBegin,
            timeEnd
        });
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(401);
            throw new Error("CREATE NEW EVENT FAILED!");
        }
    } else {
        console.log("KIỂM TRA LẠI THỜI GIAN NHẬP VÀO!");
        throw new Error("KIỂM TRA LẠI THỜI GIAN NHẬP VÀO!");
    }
});

module.exports = { createNewEvent }