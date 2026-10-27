const mongoose = require('mongoose');
const { DELIVERY_STATUS } = require('../constants');
const schema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: Object.values(DELIVERY_STATUS), default: DELIVERY_STATUS.PENDING, required: true },
  destination: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Delivery', schema);
