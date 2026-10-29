
const Delivery = require('../models/Delivery');

class DeliveryRepository {
  async getAll() {
    return Delivery.find()
      .select('-__v')
      .lean();
  }

  async getById(id) {
    return Delivery.findById(id)
      .select('-__v')
      .lean();
  }

  async getByOrder(orderId) {
    return Delivery.findOne({ order: orderId })
      .select('-__v')
      .lean();
  }

  async create(data) {
    return Delivery.create(data);
  }

  async update(id, data) {
    return Delivery.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })
      .select('-__v')
      .lean();
  }
}

module.exports = new DeliveryRepository();
