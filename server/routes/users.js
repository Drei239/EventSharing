var express = require("express");
var router = express.Router();
const {
  getAllUser,
  registerUser,
  getUserProfile,
  getUserPersonal,
  updateUser,
} = require("../controllers/userController");
const {
  authMiddleware,
  checkisUser,
  verifyAmin,
} = require("../middleware/authMiddeware");

//1.GET ALL USER INFO
router.get("/all", getAllUser);

//2.REGISTER NEW USER
router.post("/register", registerUser);

//3.GET USER INFO BY ID
router.get("/profile/:id", getUserProfile);

router.get("/account", getUserPersonal);

router.get("update", updateUser);
module.exports = router;
