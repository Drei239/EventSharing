const express = require("express");
const router = express.Router();

const {
  getAllUser,
  register,
  authLogin,
  profileUser,
  updateUserById,
  refresh,
  checkAccount,
  logout,
  deleted,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  registerValidate,
  loginValidate,
  updateUserValidate,
} = require("../middleware/validate");
const { ref } = require("joi");

router.get("/profile", protect, profileUser);
router.get("/getall", protect, isAdmin, getAllUser);
router.post("/login", authLogin);
router.post("/register", registerValidate, register);
router.post("/check", checkAccount);
router.get("/logout", logout);
router.post("/update/:id", protect, updateUserValidate, updateUserById);
router.delete("/admin/:id", protect, isAdmin, deleted);

// router.get("/account", getUserPersonal);

// router.get("update", updateUser);
module.exports = router;
