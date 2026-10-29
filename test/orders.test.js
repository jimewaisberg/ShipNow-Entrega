
const { test } = require('node:test');
const assert = require('node:assert/strict');

const orderService = require('../src/services/order.service');
const { AppError } = require('../src/errors/AppError');

test('Orders rechaza un ID de pedido inválido', async () => {
  await assert.rejects(
    () => orderService.getById('id-invalido'),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA' &&
      error.statusCode === 400
  );
});

test('Orders rechaza un total negativo', async () => {
  await assert.rejects(
    () =>
      orderService.create({
        customer: '507f1f77bcf86cd799439011',
        total: -100
      }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA'
  );
});

test('Orders rechaza una prioridad inválida', async () => {
  await assert.rejects(
    () =>
      orderService.create({
        customer: '507f1f77bcf86cd799439011',
        total: 1500,
        priority: 'URGENT'
      }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA'
  );
});

test('Orders rechaza un estado inválido', async () => {
  await assert.rejects(
    () =>
      orderService.update('507f1f77bcf86cd799439011', {
        status: 'CANCELADO'
      }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_STATUS'
  );
});

test('Orders rechaza un ID de cliente inválido', async () => {
  await assert.rejects(
    () =>
      orderService.create({
        customer: 'cliente-invalido',
        total: 1500
      }),
    error =>
      error instanceof AppError &&
      error.code === 'INVALID_DATA'
  );
});

test('Orders crea un pedido válido con estado PENDING', async () => {
    const userRepository = require('../src/repositories/user.repository');
    const orderRepository = require('../src/repositories/order.repository');
  
    const originalGetById = userRepository.getById;
    const originalCreate = orderRepository.create;
  
    const customerId = '507f1f77bcf86cd799439011';
  
    try {
      userRepository.getById = async () => ({
        _id: customerId,
        role: 'user'
      });
  
      orderRepository.create = async data => ({
        _id: '507f191e810c19729de860ea',
        ...data
      });
  
      const order = await orderService.create({
        customer: customerId,
        total: 1500,
        priority: 'HIGH'
      });
  
      assert.equal(order.customer, customerId);
      assert.equal(order.total, 1500);
      assert.equal(order.priority, 'HIGH');
      assert.equal(order.status, 'PENDING');
    } finally {
      userRepository.getById = originalGetById;
      orderRepository.create = originalCreate;
    }
  });
  
  test('Orders actualiza correctamente un pedido', async () => {
    const orderRepository = require('../src/repositories/order.repository');
    const originalUpdate = orderRepository.update;
  
    try {
      orderRepository.update = async (id, data) => ({
        _id: id,
        ...data
      });
  
      const order = await orderService.update(
        '507f1f77bcf86cd799439011',
        { status: 'SHIPPED' }
      );
  
      assert.equal(order.status, 'SHIPPED');
    } finally {
      orderRepository.update = originalUpdate;
    }
  });
  