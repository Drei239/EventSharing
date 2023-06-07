let express = require("express");
let router = express.Router();
const { createNewEvent, getPublicEvents,
    getEventById, getEventByCreator,
    updateEvent, getEventByTitle } = require("../controllers/eventController");

//1.CREATE NEW EVENT
router.post("/create", createNewEvent);

//2.GET ALL EVENT STAUS = "PUBLIC"
router.get("/all", getPublicEvents);

//3.GET EVENT BY ID
//PUBLIC CHO NGƯỜI SỬ DỤNG XEM CHI TIẾT CÁC THÔNG TIN VỀ 1 SỰ KIỆN
router.get("/:id", getEventById);

//4.GET EVENT BY CREATOR
//PUBLIC CHO NGƯỜI SỬ DỤNG XEM THÔNG TIN VỀ CÁC SỰ KIỆN CỦA 1 NGƯỜI TCSK
//LẤY DANH SÁCH SỰ KIỆN CỦA 1 USER ĐỂ HIỂN THỊ TRÊN PROFILE?
//NẾU REQUEST USER = CREATOR -> GET FULL EVENT (BAO GỒM DRAFT, PENDING)
//NẾU REQUEST USER = GUEST -> DON'T GET DRAFT, PENDING
router.get("/user/:id", getEventByCreator);

//5.UPDATE EVENT
//CHO PHÉP NTCSK CẬP NHẬT THÔNG TIN SỰ KIỆN KHI VẪN CÒN LÀ BẢN NHÁP (STATUS = "DRAFT")
//CHO PHÉP ADMIN PHÊ DUYỆT HIỂN THỊ SỰ KIỆN (STATUS = "PENDING" => "PUBLIC")
router.put("/update/:id", updateEvent);

//6.FIND EVENT BY TITLE
router.get("/", getEventByTitle);

module.exports = router;