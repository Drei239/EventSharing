const asyncHandler = require('express-async-handler');
const fs = require('fs');
const { cloudinaryUploadImg } = require('../utils/cloudinary');
const uploadImages = async (files, folder) => {
  const urls = [];
  for (const file of files) {
    const { path } = file;
    const url = await cloudinaryUploadImg(path, folder);
    urls.push(url);
    fs.unlinkSync(path);
  }
  return urls;
};
module.exports = { uploadImages };
