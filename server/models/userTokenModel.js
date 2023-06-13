const mongoose = require('mongoose');
const { Schema } = mongoose;

const userTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400,
  },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

module.exports = UserToken;
