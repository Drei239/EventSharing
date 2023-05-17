const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

//1.GET ALL USER INFO
const getAllUser = asyncHandler(async (req, res) => {
    const users = await userModel.find({});
    res.json(users);
});

module.exports = {
    getAllUser
}