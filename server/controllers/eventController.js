const asyncHandler = require("express-async-handler");
const eventModel = require("../models/eventModel");
const eventService = require("../services/eventServices");
const { eventError, eventSucc } = require("../validators/responsiveMessages");

//Lưu data theo UTC time
//Tìm cách lấy client timezone convert cho ra giờ theo timezone của họ
function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
        return new Date(
            new Date(date).toLocaleString('en-US', {
                timeZone,
            }),
        );
    }

    return new Date(
        date.toLocaleString('en-US', {
            timeZone,
        }),
    );
}

const date = new Date();
console.log("new Date", date);

const hcmDate = changeTimeZone(date, 'Asia/Saigon');
console.log("Asia/Saigon Date", hcmDate);

console.log("toLocaleString Date",
    date.toLocaleString('en-US', {
        timeZone: 'Asia/Saigon',
    }),
);

function inputTimeValidation(timeEndSignup, timeBegin, timeEnd) {
    if (Date.parse(timeEndSignup) < Date.parse(timeBegin) &&
        Date.parse(timeEndSignup) < Date.parse(timeEnd) &&
        Date.parse(timeBegin) < Date.parse(timeEnd)) {
        return true;
    } else {
        return false;
    }
}

//1.CREATE NEW EVENT
const createNewEvent = asyncHandler(async (req, res) => {
    const { title, description, banner, imageList,
        category, type, fee, location,
        timeEndSignup, timeBegin, timeEnd, creator,
        limitUser, reviews } = req.body;
    // Sau khi gán userInfo = req.user 
    // const creator = req.user.id;
    // loại bỏ giá trị creator ở req.body
    if (inputTimeValidation(timeEndSignup, timeBegin, timeEnd)) {
        const newEvent = await eventModel.create({
            title, description, banner, imageList,
            category, type, fee, location,
            timeEndSignup, timeBegin, timeEnd, creator,
            limitUser, reviews
        });
        if (newEvent) {
            res.status(200).json(newEvent);
            // console.log(
            //     newEvent.timeEndSignup.toLocaleString('en-US', {
            //         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            //     }),
            // );
            // console.log(newEvent.timeEndSignup);
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
        return res.status(200).json({ status: 200, data: events, message: eventSucc.SUC_2 })
    } catch (error) {
        return res.status(400).json({ status: 400, message: eventError.ERR_2 });
    }
});
// search by title + filter 
const getFilterEvents=asyncHandler(async(req,res)=>{
    const {keyword}=req.query;
    const queryObj={...req.query}
    try {
        const excludeField=["page","sort","limit","keyword"];
        // loc tu khoa
        excludeField.forEach((el)=> delete queryObj[el]);

        let queryStr=JSON.stringify(queryObj);
        // thay cac gia tri cua tu khoa     
        queryStr=queryStr.replace(/\b(gt|gte|lte|lt)\b/g,(match)=> `$${match}`)
        let query;
        if(keyword !== "" && keyword){
            const queryObj={$or:[ { 'title': { $regex: keyword, $options: 'i' } },
           ,{ 'title': { $regex: keyword, $options: 'i' } },
            { 'location': { $regex: keyword, $options: 'i' } }, { 'category': { $regex: keyword, $options: 'i' } }],... JSON.parse(queryStr)};
            query=eventModel.find(queryObj).populate('creator');
        }
        else{
            query=eventModel.find(JSON.parse(queryStr)).populate('creator');
        }
        if(req.query.sort){
            const sortBy=req.query.sort.split(",").join(" ");
            query=query.sort(sortBy);
        }
        else{
            query=query.sort("-createdAt");
        }
    const limit=req.query.limit || 10;
    const page=req.query.page || 1;
    const skip=(Number(page)-1)* limit;
    query = query.skip(skip).limit(limit).exec();
    // const eventCount=await eventModel.countDocuments();
    const events=await query;
   return res.status(200).json({status:200,data:events,message: eventError.ERR_2})
        
}
catch(err){
    console.log(err)
    throw Error(err);
}
})
// function getPublicEvent() {
//     eventService.getPublicEvent();
// }

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
});

//5.UPDATE EVENT
//CHO PHÉP NTCSK CẬP NHẬT THÔNG TIN SỰ KIỆN KHI VẪN CÒN LÀ BẢN NHÁP (STATUS = "DRAFT")
//CHO PHÉP ADMIN PHÊ DUYỆT HIỂN THỊ SỰ KIỆN (STATUS = "PENDING" => "PUBLIC")
const updateEvent = asyncHandler(async (req, res) => {
    const findId = req.params.id;
    const { title, description } = req.body;
    const updateEvent = await eventService.updateEvent(findId, title, description);
    if (updateEvent) {
        res.status(200).json(updateEvent);
    } else {
        res.status(401);
        throw new Error("UPDATE EVENT FAILED!");
    }
})

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

//6.FIND EVENT BY TITLE
const getEventByTitle = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword;
    const searchQuery = keyword ? { title: { $regex: keyword } } : {};
    const searchedEvent = await eventModel.find({ ...searchQuery });
    if (searchedEvent) {
        res.status(200).json(searchedEvent);
    } else {
        res.status(401);
        throw new Error("KHÔNG TÌM THẤY SỰ KIỆN!");
    }
})

module.exports = {
    createNewEvent, getPublicEvents,
    getEventById, getEventByCreator,
    updateEvent, getEventByTitle,getFilterEvents
}