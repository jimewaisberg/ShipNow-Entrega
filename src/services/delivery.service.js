
const mongoose = require('mongoose');
const repository = require('../repositories/delivery.repository');
const orderRepository = require('../repositories/order.repository');
const userRepository = require('../repositories/user.repository');

const { DELIVERY_STATUS, USER_ROLES } = require('../constants');
const { AppError } = require('../errors/AppError');

class DeliveryService {
  validateId(id) {
    if (!mongoose.isObjectIdOrHexString(id)) {
      throw new AppError('INVALID_DATA', 'ID inválido');
    }
  }

  async getAll() {
    return repository.getAll();
  }

  async getById(id) {
    this.validateId(id);

    const delivery = await repository.getById(id);

    if (!delivery) {
        throw new AppError('DELIVERY_NOT_FOUND');
    }

    return delivery;
  }

  async validateDriver(driverId) {
    this.validateId(driverId);

    const driver = await userRepository.getById(driverId);

    if (!driver) {
      throw new AppError('USER_NOT_FOUND');
    }

    if (driver.role !== USER_ROLES.DRIVER) {
      throw new AppError(
        'INVALID_DATA',
        'El usuario asignado debe tener el rol driver'
      );
    }
  }

  async create(data) {
    const { order, driver, destination } = data || {};

    if (!order || typeof destination !== 'string' || !destination.trim()) {
      throw new AppError(
        'INVALID_DATA',
        'El pedido y el destino son obligatorios'
      );
    }

    this.validateId(order);

    const existingOrder = await orderRepository.getById(order);

    if (!existingOrder) {
      throw new AppError('ORDER_NOT_FOUND');
    }

    const existingDelivery = await repository.getByOrder(order);

    if (existingDelivery) {
      throw new AppError(
        'DUPLICATE_RESOURCE',
        'El pedido ya tiene una entrega'
      );
    }

    if (driver != null) {
      await this.validateDriver(driver);
    }

    return repository.create({
      order,
      driver: driver ?? null,
      destination: destination.trim(),
      status: DELIVERY_STATUS.PENDING
    });
  }

  async update(id, data) {
    this.validateId(id);

    const allowed = ['status', 'driver', 'destination'];

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
      !Object.values(DELIVERY_STATUS).includes(changes.status)
    ) {
      throw new AppError('INVALID_STATUS');
    }

    if ('driver' in changes && changes.driver != null) {
      await this.validateDriver(changes.driver);
    }

    if ('destination' in changes) {
      if (
        typeof changes.destination !== 'string' ||
        !changes.destination.trim()
      ) {
        throw new AppError('INVALID_DATA', 'Destino inválido');
      }

      changes.destination = changes.destination.trim();
    }

    const delivery = await repository.update(id, changes);

    if (!delivery) {
      throw new AppError('INVALID_DATA', 'Entrega no encontrada');
    }

    return delivery;
  }
}

module.exports = new DeliveryService();
