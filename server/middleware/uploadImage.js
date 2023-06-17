const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + '-' + uniqueSuffix + '.jpeg');
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported file format' }, false);
  }
};
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});
const eventImgResize = async (req, res, next) => {
  console.log('b');
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(500, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/images/events/${file.filename}`);
      fs.unlinkSync(`public/images/${file.filename}`);
      return (file.path = `public/images/events/${file.filename}`);
    })
  );
  next();
};
module.exports = { uploadPhoto, eventImgResize };
