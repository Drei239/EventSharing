var express = require('express');
var router = express.Router();
const { getAllUser, registerUser, getUserProfile } = require('../controllers/userController');

//1.GET ALL USER INFO
router.get('/all', getAllUser);

//2.REGISTER NEW USER
router.post('/register', registerUser);

//3.GET USER INFO BY ID
router.get("/profile/:id", getUserProfile);

module.exports = router;
