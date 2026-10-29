
const { test } = require('node:test');
const assert = require('node:assert/strict');

const deliveryService = require('../src/services/delivery.service');
const { AppError } = require('../src/errors/AppError');

const validId = '507f1f77bcf86cd799439011';

test('Deliveries rechaza un ID inválido', async () => {
  await assert.rejects(
    () => deliveryService.getById('id-invalido'),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA' &&
      error.statusCode === 400
  );
});

test('Deliveries requiere pedido y destino', async () => {
  await assert.rejects(
    () => deliveryService.create({
      order: validId,
      destination: ''
    }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA'
  );
});

test('Deliveries rechaza un ID de pedido inválido', async () => {
  await assert.rejects(
    () => deliveryService.create({
      order: 'pedido-invalido',
      destination: 'Av. Corrientes 1234'
    }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA'
  );
});

test('Deliveries rechaza un estado inválido', async () => {
  await assert.rejects(
    () => deliveryService.update(validId, {
      status: 'CANCELADO'
    }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_STATUS' &&
      error.statusCode === 400
  );
});

test('Deliveries rechaza un destino vacío al actualizar', async () => {
  await assert.rejects(
    () => deliveryService.update(validId, {
      destination: '   '
    }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA'
  );
});


test('Deliveries crea una entrega válida con estado PENDING', async () => {
    const orderRepository = require('../src/repositories/order.repository');
    const deliveryRepository = require('../src/repositories/delivery.repository');
  
    const originalOrder = orderRepository.getById;
    const originalGetByOrder = deliveryRepository.getByOrder;
    const originalCreate = deliveryRepository.create;
  
    const orderId = '507f1f77bcf86cd799439011';
  
    try {
      orderRepository.getById = async () => ({ _id: orderId });
      deliveryRepository.getByOrder = async () => null;
      deliveryRepository.create = async data => ({
        _id: '507f191e810c19729de860ea',
        ...data
      });
  
      const delivery = await deliveryService.create({
        order: orderId,
        destination: 'Av. Corrientes 1234'
      });
  
      assert.equal(delivery.order, orderId);
      assert.equal(delivery.destination, 'Av. Corrientes 1234');
      assert.equal(delivery.status, 'PENDING');
      assert.equal(delivery.driver, null);
    } finally {
      orderRepository.getById = originalOrder;
      deliveryRepository.getByOrder = originalGetByOrder;
      deliveryRepository.create = originalCreate;
    }
  });
  
  test('Deliveries actualiza correctamente una entrega', async () => {
    const deliveryRepository = require('../src/repositories/delivery.repository');
    const originalUpdate = deliveryRepository.update;
  
    try {
      deliveryRepository.update = async (id, data) => ({
        _id: id,
        ...data
      });
  
      const delivery = await deliveryService.update(
        '507f1f77bcf86cd799439011',
        { destination: 'Av. Santa Fe 1500' }
      );
  
      assert.equal(delivery.destination, 'Av. Santa Fe 1500');
    } finally {
      deliveryRepository.update = originalUpdate;
    }
  });
  
