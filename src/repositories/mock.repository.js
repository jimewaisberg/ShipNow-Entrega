const User = require('../models/User');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const { USER_ROLES } = require('../constants');

class MockRepository {
  // Inserción por etapas: referencias reales de MongoDB, no IDs ficticios.
  // Si una etapa falla, solo se eliminan los documentos de esta ejecución.
  async seed(data, passwordHash) {
    let insertedUsers = [];
    let insertedOrders = [];
    let insertedDeliveries = [];
    try {
      insertedUsers = await User.insertMany([...data.users, ...data.drivers].map(({ mockId, ...person }) => ({ ...person, password: passwordHash })), { ordered: true });
      const userIds = new Map([...data.users, ...data.drivers].map((user, i) => [user.mockId, insertedUsers[i]._id]));
      insertedOrders = await Order.insertMany(data.orders.map(({ mockId, customer, ...order }) => ({ ...order, customer: userIds.get(customer) })), { ordered: true });
      const orderIds = new Map(data.orders.map((order, i) => [order.mockId, insertedOrders[i]._id]));
      insertedDeliveries = await Delivery.insertMany(data.deliveries.map(({ mockId, order, driver, ...delivery }) => ({
        ...delivery, order: orderIds.get(order), driver: driver ? userIds.get(driver) : null
      })), { ordered: true });
      return {
        inserted: { users: data.users.length, drivers: data.drivers.length, orders: insertedOrders.length, deliveries: insertedDeliveries.length },
        total: insertedUsers.length + insertedOrders.length + insertedDeliveries.length,
        ids: { users: insertedUsers.map(x => x._id), orders: insertedOrders.map(x => x._id), deliveries: insertedDeliveries.map(x => x._id) }
      };
    } catch (err) {
      // insertMany puede insertar parcialmente antes de lanzar: recuperar por email único de este lote.
      const emails = [...data.users, ...data.drivers].map(u => u.email);
      const createdUsers = await User.find({ email: { $in: emails } }).select('_id').lean();
      const ids = createdUsers.map(u => u._id);
      const orders = await Order.find({ customer: { $in: ids } }).select('_id').lean();
      await Delivery.deleteMany({ order: { $in: orders.map(o => o._id) } });
      await Order.deleteMany({ customer: { $in: ids } });
      await User.deleteMany({ _id: { $in: ids }, role: { $in: [USER_ROLES.USER, USER_ROLES.DRIVER] } });
      throw err;
    }
  }
}
module.exports = new MockRepository();
