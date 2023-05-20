const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Event" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    isPaid: { type: Boolean, required },
    isRefund: {type: Boolean, required: true, default: false},
    isJoined: { type: Boolean }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;