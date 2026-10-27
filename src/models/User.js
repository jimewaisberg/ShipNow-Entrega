const mongoose = require('mongoose');
const { USER_ROLES } = require('../constants');
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  age: { type: Number, required: true, min: 0 },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
