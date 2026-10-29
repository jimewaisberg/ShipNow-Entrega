
const mongoose = require('mongoose');

const User = require('../models/User');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');

class MockRepository {
  async deleteDeliveriesByIds(ids) {
    if (!ids.length) return;
    await Delivery.deleteMany({ _id: { $in: ids } });
  }

  async deleteOrdersByIds(ids) {
    if (!ids.length) return;
    await Order.deleteMany({ _id: { $in: ids } });
  }

  async deleteUsersByIds(ids) {
    if (!ids.length) return;
    await User.deleteMany({ _id: { $in: ids } });
  }

  async rollback({ userIds = [], orderIds = [], deliveryIds = [] }) {
    const errors = [];

    // Primero se eliminan las entregas, luego los pedidos
    // y finalmente los usuarios.
    const operations = [
      () => this.deleteDeliveriesByIds(deliveryIds),
      () => this.deleteOrdersByIds(orderIds),
      () => this.deleteUsersByIds(userIds)
    ];

    for (const operation of operations) {
      try {
        await operation();
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length) {
      throw new AggregateError(
        errors,
        'No se pudo completar el rollback de mocks'
      );
    }
  }

  async seed(data, passwordHash) {
    const people = [...data.users, ...data.drivers];

    // Reservamos identificadores únicos antes de insertar.
    // Así podemos limpiar incluso una inserción parcial.
    const usersToInsert = people.map(({ mockId, ...person }) => ({
      ...person,
      _id: new mongoose.Types.ObjectId(),
      password: passwordHash
    }));

    const userMap = new Map(
      people.map((person, index) => [
        person.mockId,
        usersToInsert[index]._id
      ])
    );

    const ordersToInsert = data.orders.map(
      ({ mockId, customer, ...order }) => ({
        ...order,
        _id: new mongoose.Types.ObjectId(),
        customer: userMap.get(customer)
      })
    );

    const orderMap = new Map(
      data.orders.map((order, index) => [
        order.mockId,
        ordersToInsert[index]._id
      ])
    );

    const deliveriesToInsert = data.deliveries.map(
      ({ mockId, order, driver, ...delivery }) => ({
        ...delivery,
        _id: new mongoose.Types.ObjectId(),
        order: orderMap.get(order),
        driver: driver ? userMap.get(driver) : null
      })
    );

    const insertedIds = {
      userIds: usersToInsert.map(user => user._id),
      orderIds: ordersToInsert.map(order => order._id),
      deliveryIds: deliveriesToInsert.map(delivery => delivery._id)
    };

    try {
      const insertedUsers = await User.insertMany(
        usersToInsert,
        { ordered: true }
      );

      const insertedOrders = await Order.insertMany(
        ordersToInsert,
        { ordered: true }
      );

      const insertedDeliveries = await Delivery.insertMany(
        deliveriesToInsert,
        { ordered: true }
      );

      return {
        inserted: {
          users: data.users.length,
          drivers: data.drivers.length,
          orders: insertedOrders.length,
          deliveries: insertedDeliveries.length
        },
        total:
          insertedUsers.length +
          insertedOrders.length +
          insertedDeliveries.length,
        ids: {
          users: insertedUsers.map(user => user._id),
          orders: insertedOrders.map(order => order._id),
          deliveries: insertedDeliveries.map(delivery => delivery._id)
        }
      };
    } catch (error) {
      try {
        await this.rollback(insertedIds);
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }

      throw error;
    }
  }
}

module.exports = new MockRepository();
