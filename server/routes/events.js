let express = require("express");
let router = express.Router();
const {
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
  createNewReview,
  getEventsOrganizers,
  cancelEvent,
  removeEventDraft,
  confirmEventCompleted,
  changeStatusPublic,
} = require("../controllers/eventController");
const { protect, verifyUser } = require("../middleware/authMiddleware");

//1.CREATE NEW EVENT
router.post("/create", protect, createNewEvent);

//2.GET ALL EVENT STAUS = "PUBLIC"
router.get("/all", getPublicEvents);
//search + filter +getAll
router.get("/getFilter", getFilterEvents);
//3.GET EVENT BY ID
//PUBLIC CHO NGƯỜI SỬ DỤNG XEM CHI TIẾT CÁC THÔNG TIN VỀ 1 SỰ KIỆN
router.get("/get/:id", getEventById);

//4.GET EVENT BY CREATOR
//PUBLIC CHO NGƯỜI SỬ DỤNG XEM THÔNG TIN VỀ CÁC SỰ KIỆN CỦA 1 NGƯỜI TCSK
//LẤY DANH SÁCH SỰ KIỆN CỦA 1 USER ĐỂ HIỂN THỊ TRÊN PROFILE?
//NẾU REQUEST USER = CREATOR -> GET FULL EVENT (BAO GỒM DRAFT, PENDING)
//NẾU REQUEST USER = GUEST -> DON'T GET DRAFT, PENDING
// router.get("/user/:id", getEventByCreator);

//5.UPDATE EVENT
//CHO PHÉP NTCSK CẬP NHẬT THÔNG TIN SỰ KIỆN KHI VẪN CÒN LÀ BẢN NHÁP (STATUS = "DRAFT")
router.put("/update/:id", protect, updateDraftEventInfo);

//6.FIND EVENT BY TITLE

// router.get("/search/:keyword", getEventByTitle);

//7.GET EVENTS BY QUERY
// router.get('/dasdas', getQueryEvents);

//9.CREATE NEW REVIEW & UPDATE RATING
router.put("/createReview/:id", protect, createNewReview);
//
router.get("/highlight", highlightEvents);
//
router.get("/registered-event", protect, getRegisteredEvent);
//
router.get("/joined-event", protect, getJoinedEvent);
//
router.get("/organizers/:id", getEventsOrganizers);
//
router.get("/user/:id", protect, verifyUser, getAllEventOfUser);
//
router.delete("/remove/:id", protect, removeEventDraft);
//
router.put("/cancel/:id", protect, cancelEvent);
//
router.put("/confirm-completed/:id", protect, confirmEventCompleted);

router.put("/change-public/:id", protect, changeStatusPublic);
module.exports = router;
