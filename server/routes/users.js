const express = require("express");
const router = express.Router();

const {
  getAllUser,
  register,
  authLogin,
  profileUser,
  updateUserById,
  checkAccount,
  logout,
  deleted,
  refreshToken,
  ratingUser,
} = require("../controllers/userController");
const {
  protect,
  isAdmin,
  verifyUser,
} = require("../middleware/authMiddleware");

const {
  registerValidate,
  loginValidate,
  updateUserValidate,
} = require("../middleware/validate");
const { ref } = require("joi");

router.get("/profile", protect, profileUser);
router.get("/getall", getAllUser);
router.post("/login", authLogin);
router.post("/register", registerValidate, register);
router.post("/check", checkAccount);
router.get("/logout", logout);
router.put("/update/:id", protect, verifyUser, updateUserById);
router.delete("/delete/:id", protect, verifyUser, deleted);
router.put("/rating/:id", protect, ratingUser);

// router.get("update", updateUser);
module.exports = router;
