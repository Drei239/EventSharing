const express = require("express");
const { eventImgResize, uploadPhoto } = require("../middleware/uploadImage");
const { uploadImage } = require("../controllers/uploadController");
const router = express.Router();
router.post("/", uploadPhoto.array("images", 10), eventImgResize, uploadImage);
module.exports = router;
