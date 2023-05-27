const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, required: true },
    //Mảng image có thể null nhưng giá trị khởi tạo trên client không thể truyền null vào
    //Mỗi giá trị trong mảng tương đương với 1 đường dẫn hình ảnh
    imageList: [{ type: String, required: true }],
    category: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" }],
    //Type: True = Offline, False = Online?
    type: { type: Boolean, required: true },
    fee: { type: Number, required: true, default: 0 },
    location: { type: String, required: true },
    timeEndSignup: { type: Date, required: true },
    timeBegin: { type: Date, required: true },
    timeEnd: { type: Date, required: true },
    status: { type: String, required: true, default: 'Draft' },
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    limitUser: { type: Number, required: true },
    // listUser: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }],
    reviews: [reviewSchema],
    eventRating: { type: Number, required: true, default: 0 }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

