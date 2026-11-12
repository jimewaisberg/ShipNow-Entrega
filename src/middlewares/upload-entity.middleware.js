const mongoose = require('mongoose');
const User = require('../models/User');
const Delivery = require('../models/Delivery');
const { AppError } = require('../errors/AppError');

function validateUploadEntity(entity) {
  return async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        throw new AppError('INVALID_DATA', 'Identificador inválido');
      }

      const model = entity === 'user' ? User : Delivery;
      const exists = await model.exists({ _id: id });

      if (!exists) {
        throw new AppError(
          entity === 'user' ? 'USER_NOT_FOUND' : 'DELIVERY_NOT_FOUND'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { validateUploadEntity };
