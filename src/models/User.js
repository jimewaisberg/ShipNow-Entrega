const mongoose = require('mongoose');
const { USER_ROLES } = require('../constants');
const fileMetadataSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  documentType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true });

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  age: { type: Number, required: true, min: 0 },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER },
  documents: { type: [fileMetadataSchema], default: [] }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
