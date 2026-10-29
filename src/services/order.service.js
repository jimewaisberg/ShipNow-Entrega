
const mongoose = require('mongoose');
const repository = require('../repositories/order.repository');
const userRepository = require('../repositories/user.repository');
const { ORDER_STATUS, ORDER_PRIORITY } = require('../constants');
const { AppError, OrderNotFoundError } = require('../errors/AppError');

class OrderService {
  validateId(id) {
    if (!mongoose.isObjectIdOrHexString(id)) {
      throw new AppError('INVALID_DATA', 'ID de pedido inválido');
    }
  }

  async getAll() {
    return repository.getAll();
  }

  async getById(id) {
    this.validateId(id);

    const order = await repository.getById(id);

    if (!order) {
      throw new OrderNotFoundError();
    }

    return order;
  }

  async create(data) {
    const { customer, total, priority } = data || {};

    if (
      !customer ||
      typeof total !== 'number' ||
      !Number.isFinite(total) ||
      total < 0
    ) {
      throw new AppError(
        'INVALID_DATA',
        'customer y total válido son obligatorios'
      );
    }

    if (!mongoose.isObjectIdOrHexString(customer)) {
      throw new AppError('INVALID_DATA', 'ID de cliente inválido');
    }

    const selectedPriority = priority ?? ORDER_PRIORITY.NORMAL;

    if (!Object.values(ORDER_PRIORITY).includes(selectedPriority)) {
      throw new AppError('INVALID_DATA', 'Prioridad inválida');
    }

    const user = await userRepository.getById(customer);

    if (!user) {
      throw new AppError('USER_NOT_FOUND');
    }

    return repository.create({
      customer,
      total,
      priority: selectedPriority,
      status: ORDER_STATUS.PENDING
    });
  }

  async update(id, data) {
    this.validateId(id);

    const allowed = ['status', 'priority'];
    const changes = Object.fromEntries(
      Object.entries(data || {}).filter(([key]) =>
        allowed.includes(key)
      )
    );

    if (!Object.keys(changes).length) {
      throw new AppError(
        'INVALID_DATA',
        'No se indicaron campos editables'
      );
    }

    if (
      'status' in changes &&
      !Object.values(ORDER_STATUS).includes(changes.status)
    ) {
      throw new AppError('INVALID_STATUS');
    }

    if (
      'priority' in changes &&
      !Object.values(ORDER_PRIORITY).includes(changes.priority)
    ) {
      throw new AppError('INVALID_DATA', 'Prioridad inválida');
    }

    const order = await repository.update(id, changes);

    if (!order) {
      throw new OrderNotFoundError();
    }

    return order;
  }
}

module.exports = new OrderService();
