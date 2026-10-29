
const Order = require('../models/Order');

class OrderRepository {
  async getAll() {
    return Order.find()
      .select('-__v')
      .lean();
  }

  async getById(id) {
    return Order.findById(id)
      .select('-__v')
      .lean();
  }

  async create(data) {
    return Order.create(data);
  }

  async update(id, data) {
    return Order.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })
      .select('-__v')
      .lean();
  }
}

module.exports = new OrderRepository();
