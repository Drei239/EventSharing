const express = require('express');
const router = express.Router();

const {
  getAllUser,
  register,
  authLogin,
  profileUser,
  updateUserById,
  logout,
  deleted,
  refreshToken,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  registerValidate,
  loginValidate,
  updateUserValidate,
} = require('../middleware/validate');
const { ref } = require('joi');

router.get('/profile', protect, profileUser);
router.get('/getall', protect, isAdmin, getAllUser);
router.get('/logout', logout);
router.get('/refresh', refreshToken);
router.post('/login', authLogin);
router.post('/register', registerValidate, register);
router.post('/update/:id', protect, updateUserValidate, updateUserById);
router.delete('/admin/:id', protect, isAdmin, deleted);

// router.get("update", updateUser);
module.exports = router;
