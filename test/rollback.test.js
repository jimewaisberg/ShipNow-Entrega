
const { test } = require('node:test');
const assert = require('node:assert/strict');

const repository = require('../src/repositories/mock.repository');

test('rollback elimina entregas, pedidos y usuarios en orden', async () => {
  const calls = [];

  const originals = {
    deleteDeliveriesByIds: repository.deleteDeliveriesByIds,
    deleteOrdersByIds: repository.deleteOrdersByIds,
    deleteUsersByIds: repository.deleteUsersByIds
  };

  try {
    repository.deleteDeliveriesByIds = async ids => {
      calls.push(['entregas', ids]);
    };

    repository.deleteOrdersByIds = async ids => {
      calls.push(['pedidos', ids]);
    };

    repository.deleteUsersByIds = async ids => {
      calls.push(['usuarios', ids]);
    };

    await repository.rollback({
      userIds: ['user-nuevo'],
      orderIds: ['order-nuevo'],
      deliveryIds: ['delivery-nueva']
    });

    assert.deepEqual(calls, [
      ['entregas', ['delivery-nueva']],
      ['pedidos', ['order-nuevo']],
      ['usuarios', ['user-nuevo']]
    ]);
  } finally {
    Object.assign(repository, originals);
  }
});

test('rollback no incluye IDs de registros anteriores', async () => {
  const deletedIds = [];

  const original = repository.deleteUsersByIds;

  try {
    repository.deleteUsersByIds = async ids => {
      deletedIds.push(...ids);
    };

    await repository.rollback({
      userIds: ['usuario-creado-en-esta-ejecucion']
    });

    assert.deepEqual(deletedIds, [
      'usuario-creado-en-esta-ejecucion'
    ]);

    assert.equal(
      deletedIds.includes('usuario-que-ya-existia'),
      false
    );
  } finally {
    repository.deleteUsersByIds = original;
  }
});

test('rollback continúa limpiando si falla una eliminación', async () => {
  const calls = [];

  const originals = {
    deleteDeliveriesByIds: repository.deleteDeliveriesByIds,
    deleteOrdersByIds: repository.deleteOrdersByIds,
    deleteUsersByIds: repository.deleteUsersByIds
  };

  try {
    repository.deleteDeliveriesByIds = async () => {
      calls.push('entregas');
      throw new Error('Falla simulada');
    };

    repository.deleteOrdersByIds = async () => {
      calls.push('pedidos');
    };

    repository.deleteUsersByIds = async () => {
      calls.push('usuarios');
    };

    await assert.rejects(
      () => repository.rollback({
        userIds: ['u1'],
        orderIds: ['o1'],
        deliveryIds: ['d1']
      }),
      AggregateError
    );

    assert.deepEqual(calls, [
      'entregas',
      'pedidos',
      'usuarios'
    ]);
  } finally {
    Object.assign(repository, originals);
  }
});

test('seed ejecuta rollback si falla una inserción parcial', async () => {
    const User = require('../src/models/User');
    const Order = require('../src/models/Order');
    const Delivery = require('../src/models/Delivery');
  
    const originalInsertUsers = User.insertMany;
    const originalInsertOrders = Order.insertMany;
    const originalInsertDeliveries = Delivery.insertMany;
    const originalRollback = repository.rollback;
  
    let rollbackIds = null;
    let usersInserted = [];
  
    try {
      User.insertMany = async users => {
        usersInserted = users;
        return users;
      };
  
      Order.insertMany = async () => {
        throw new Error('Falla simulada de MongoDB');
      };
  
      Delivery.insertMany = async () => {
        throw new Error('No debería llegar a esta etapa');
      };
  
      repository.rollback = async ids => {
        rollbackIds = ids;
      };
  
      const data = {
        users: [
          {
            mockId: 'user-1',
            first_name: 'Ana',
            last_name: 'Pérez',
            email: 'ana@test.com',
            age: 25,
            role: 'user'
          }
        ],
        drivers: [],
        orders: [
          {
            mockId: 'order-1',
            customer: 'user-1',
            total: 1000,
            status: 'PENDING',
            priority: 'NORMAL'
          }
        ],
        deliveries: [
          {
            mockId: 'delivery-1',
            order: 'order-1',
            driver: null,
            destination: 'Av. Corrientes 1234',
            status: 'PENDING'
          }
        ]
      };
  
      await assert.rejects(
        () => repository.seed(data, 'hash-simulado'),
        /Falla simulada de MongoDB/
      );
  
      assert.ok(rollbackIds);
      assert.equal(rollbackIds.userIds.length, 1);
      assert.equal(rollbackIds.orderIds.length, 1);
      assert.equal(rollbackIds.deliveryIds.length, 1);
  
      assert.equal(
        String(rollbackIds.userIds[0]),
        String(usersInserted[0]._id)
      );
  
    } finally {
      User.insertMany = originalInsertUsers;
      Order.insertMany = originalInsertOrders;
      Delivery.insertMany = originalInsertDeliveries;
      repository.rollback = originalRollback;
    }
  });
  