const User = require('../models/User');
const Delivery = require('../models/Delivery');

class UploadRepository {
  async addUserDocument(userId, metadata) {
    return User.findByIdAndUpdate(
      userId,
      { $push: { documents: metadata } },
      { new: true, runValidators: true }
    )
      .select('-password -__v')
      .lean();
  }

  async addDeliveryReceipt(deliveryId, metadata) {
    return Delivery.findByIdAndUpdate(
      deliveryId,
      { $push: { receipts: metadata } },
      { new: true, runValidators: true }
    )
      .select('-__v')
      .lean();
  }
}

module.exports = new UploadRepository();
