const express = require('express');
const router = express.Router();

const {
  register,
  authLogin,
  profileUser,
  updateUser,
  getUsers,
  deleted,
  updateUserById,
} = require('../controllers/userController');
const { deletedToken } = require('../controllers/refreshTokenController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { registerValidate, loginValidate, updateValidate } = require('../middleware/validate');

router.get('/profile', profileUser);

router.get('/admin', protect, isAdmin, getUsers);
router.post('/login', loginValidate, authLogin);
router.post('/register', registerValidate, register);
router.delete('/logout', deletedToken);

router.put('/profile', protect, updateValidate, updateUser);
router.put('/admin/:id', protect, isAdmin, updateUserById);
router.delete('/admin/:id', protect, isAdmin, deleted);

module.exports = router;
