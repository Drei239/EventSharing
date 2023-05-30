const express = require('express');
const router = express.Router();

const {getUsers, register, authLogin, profileUser, updateUser, updateUserById, deleted} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { registerValidate, loginValidate, updateUserValidate } = require('../middleware/validate');

router.get('/profile', profileUser);

router.get('/admin', protect, isAdmin, getUsers);
router.post('/login', loginValidate, authLogin);
router.post('/register', registerValidate, register);
router.post('/update', updateUserValidate, updateUser ),
router.put('/profile', protect, updateUser);
router.put('/admin/:id', protect, isAdmin, updateUserById);
router.delete('/admin/:id', protect, isAdmin, deleted);

module.exports = router;