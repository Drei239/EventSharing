let express = require("express");
let router = express.Router();
const { createNewEvent, getAllEvent,
    getEventById, getEventByCreator } = require("../controllers/eventController");

//1.CREATE NEW EVENT
router.post("/create", createNewEvent);

//2.GET ALL EVENT STAUS = "PUBLIC"
router.get("/all", getAllEvent);

//3.GET EVENT BY ID
//PUBLIC CHO NGƯỜI SỬ DỤNG XEM CHI TIẾT CÁC THÔNG TIN VỀ 1 SỰ KIỆN
router.get("/:id", getEventById);

//4.GET EVENT BY CREATOR
//PUBLIC CHO NGƯỜI SỬ DỤNG XEM THÔNG TIN VỀ CÁC SỰ KIỆN CỦA 1 NGƯỜI TCSK
//LẤY DANH SÁCH SỰ KIỆN CỦA 1 USER ĐỂ HIỂN THỊ TRÊN PROFILE?
//NẾU REQUEST USER = CREATOR -> GET FULL EVENT (BAO GỒM DRAFT, PENDING)
//NẾU REQUEST USER = GUEST -> DON'T GET DRAFT, PENDING
router.get("/user/:id", getEventByCreator);

module.exports = router;