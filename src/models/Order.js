const mongoose = require('mongoose');
const { ORDER_STATUS, ORDER_PRIORITY } = require('../constants');
const schema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING, required: true },
  priority: { type: String, enum: Object.values(ORDER_PRIORITY), default: ORDER_PRIORITY.NORMAL, required: true },
  total: { type: Number, required: true, min: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Order', schema);
