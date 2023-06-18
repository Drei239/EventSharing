const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Event" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    isPaid: { type: Boolean, default: true, required: true },
    isRefund: { type: Boolean, default: false, required: true },
    isJoined: { type: Boolean, default: false, required: true }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;