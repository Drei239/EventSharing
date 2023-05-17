var express = require('express');
var router = express.Router();
const { getAllUser } = require('../controllers/userController');

//1.GET ALL USER INFO
router.get('/all', getAllUser);

module.exports = router;
