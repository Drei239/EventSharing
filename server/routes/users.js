const express = require('express');
const router = express.Router();

const {getAllUser, register, authLogin, profileUser, Userupdate, updateUserById, deleted} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { registerValidate, loginValidate, updateUserValidate } = require('../middleware/validate');

router.get('/profile', profileUser);

router.get('/admin', protect, isAdmin, getAllUser);
router.post('/login', loginValidate, authLogin);
router.post('/register', registerValidate, register);
router.post('/update', updateUserValidate, Userupdate ),
router.put('/profile', protect, Userupdate);
router.put('/admin/:id', protect, isAdmin, updateUserById);
router.delete('/admin/:id', protect, isAdmin, deleted);

module.exports = router;