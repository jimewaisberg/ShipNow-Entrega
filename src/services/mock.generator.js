const { randomUUID } = require('node:crypto');
const { USER_ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } = require('../constants');
const { InvalidMockQuantityError } = require('../errors/AppError');
const firstNames = ['Ana', 'Luis', 'María', 'Pedro', 'Sofía', 'Tomás', 'Valentina', 'Mateo'];
const lastNames = ['Pérez', 'Gómez', 'López', 'García', 'Fernández', 'Ruiz'];
const priorities = Object.values(ORDER_PRIORITY);
function quantity(value) {
  const qty = value === undefined ? 5 : Number(value);

  if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
    throw new InvalidMockQuantityError();
  }

  return qty;
}
function generate(qty) {
  const tag = randomUUID().slice(0, 12);
  // Identificadores temporales para poder devolver relaciones sin consultar MongoDB.
  const users = Array.from({ length: qty }, (_, i) => ({
    mockId: `user-${tag}-${i}`,
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[i % lastNames.length],
    email: `shipnow.mock.${tag}.${i}@example.test`,
    age: 20 + (i % 40),
    role: USER_ROLES.USER
  }));
  const drivers = Array.from({ length: Math.max(1, Math.ceil(qty / 3)) }, (_, i) => ({
    mockId: `driver-${tag}-${i}`,
    first_name: firstNames[(i + 2) % firstNames.length],
    last_name: lastNames[(i + 3) % lastNames.length],
    email: `shipnow.driver.${tag}.${i}@example.test`,
    age: 22 + (i % 35),
    role: USER_ROLES.DRIVER
  }));
  const orders = Array.from({ length: qty }, (_, i) => ({
    mockId: `order-${tag}-${i}`,
    customer: users[i].mockId,
    status: ORDER_STATUS.PENDING,
    priority: priorities[i % priorities.length],
    total: 1000 + 250 * i
  }));
  const deliveries = orders.map((order, i) => ({
    mockId: `delivery-${tag}-${i}`,
    order: order.mockId,
    driver: i % 4 === 0 ? null : drivers[i % drivers.length].mockId,
    status: i % 4 === 0 ? DELIVERY_STATUS.PENDING : DELIVERY_STATUS.ASSIGNED,
    destination: `Calle de prueba ${100 + i}, Buenos Aires`
  }));
  return { users, drivers, orders, deliveries };
}
module.exports = { generate, quantity };
