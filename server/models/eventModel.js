const { date } = require('joi');
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});
const locationShecma = mongoose.Schema({
  address: { type: String },
  province: {
    name: { type: String },
    code: { type: Number },
    division_type: { type: String },
  },
  district: {
    name: { type: String },
    code: { type: Number },
    division_type: { type: String },
  },
  ward: {
    name: { type: String },
    code: { type: Number },
    division_type: { type: String },
  },
});

const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  banner: { type: String, required: true },
  //Mảng image có thể null nhưng giá trị khởi tạo trên client không thể truyền null vào
  //Mỗi giá trị trong mảng tương đương với 1 đường dẫn hình ảnh
  imageList: [{ type: String, required: true }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  isOnline: { type: Boolean, required: true },
  linkOnline: { type: String },
  fee: { type: Number, required: true, default: 0 },
  location: locationShecma,
  timeEndSignup: { type: Date, required: true, default: Date.now() },
  timeBegin: { type: Date, default: Date.now(), required: true },
  timeEnd: { type: Date, default: Date.now(), required: true },
  status: { type: String, default: 'Public' },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  limitUser: { type: Number, required: true },
  reviews: [reviewSchema],
  eventRating: { type: Number, required: true, default: 0 },
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
