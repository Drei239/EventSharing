const asyncHandler = require("express-async-handler");
const uploadService = require("../services/uploadService");
const { createError } = require("../middleware/errorHandle");
const { eventError, eventSucc } = require("../validators/responsiveMessages");

const uploadImage = asyncHandler(async (req, res) => {
  try {
    const nameFolder = req.query.folder;
    if (!nameFolder) {
      throw createError(404, "Xin hãy nhập tên folder");
    }
    const urls = await uploadService.uploadImages(req.files, nameFolder);
    res.status(200).json({ status: 200, data: urls, message: eventSucc.SUC_4 });
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
});
module.exports = { uploadImage };
