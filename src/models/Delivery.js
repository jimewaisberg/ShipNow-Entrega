const mongoose = require('mongoose');
const { DELIVERY_STATUS } = require('../constants');
const fileMetadataSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  documentType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true });

const schema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: Object.values(DELIVERY_STATUS), default: DELIVERY_STATUS.PENDING, required: true },
  destination: { type: String, required: true },
  receipts: { type: [fileMetadataSchema], default: [] }
}, { timestamps: true });
module.exports = mongoose.model('Delivery', schema);
