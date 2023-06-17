const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dz5rciyqg",
  api_key: "688648456561299",
  api_secret: "7FhMSdOROs6hpeGHL0m8xMVN4gU",
  background_removal: 1,
  background_color: "white",
});
const cloudinaryUploadImg = async (fileToUpload, folder) => {
  try {
    const result = await cloudinary.v2.uploader.upload(fileToUpload, {
      folder: folder,
    });
    return result.url;
  } catch (err) {
    console.log(err);
  }
};
const cloudinaryDeleteImg = async (fileToDelete) => {
  const result = await cloudinary.v2.uploader.destroy(fileToDelete);
  return result;
};
module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
