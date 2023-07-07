const express = require('express');
const router = express.Router();

const {
  getAllUser,
  register,
  authLogin,
  profileUser,
  updateUserById,
  getOrganizers,
  logout,
  deleted,
  refreshToken,
  ratingUser,
  highlightUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const {
  protect,
  isAdmin,
  verifyUser,
} = require('../middleware/authMiddleware');

const {
  registerValidate,
  loginValidate,
  updateUserValidate,
} = require('../middleware/validate');
const { ref } = require('joi');

router.get('/profile', protect, profileUser);
router.get('/organizers/:id', getOrganizers);
router.get('/getall', getAllUser);
router.post('/login', authLogin);
router.post('/register', registerValidate, register);
router.get('/logout', logout);
router.get('/refresh', refreshToken);
router.put('/update/:id', protect, verifyUser, updateUserById);
router.delete('/delete/:id', protect, verifyUser, deleted);
router.put('/rating/:id', protect, ratingUser);

router.get('/highlight', highlightUser);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password/:userId/:token', resetPassword);
// router.get("update", updateUser);
module.exports = router;
