const User = require('../models/User');
class UserRepository {
  async getAll() { return User.find().select('-password -__v').lean(); }
  async getById(id) { return User.findById(id).select('-password -__v').lean(); }
  async getByEmail(email) { return User.findOne({ email: email.toLowerCase() }).select('_id').lean(); }
  async create(data) { return User.create(data); }
  async update(id, data) { return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password -__v').lean(); }
  async delete(id) { return User.findByIdAndDelete(id).select('-password -__v').lean(); }
}
module.exports = new UserRepository();
