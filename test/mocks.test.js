const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generate, quantity } = require('../src/services/mock.generator');
const { USER_ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } = require('../src/constants');
test('qty: solo enteros en el rango permitido', () => {
  assert.equal(quantity(undefined), 5);
  assert.equal(quantity('10'), 10);
  for (const val of ['0','51','2.5','abc']) assert.throws(() => quantity(val));
});
test('bundle conserva relaciones, roles, estados y prioridades válidos', () => {
  const d = generate(10);
  assert.equal(d.users.length, 10);
  assert.equal(d.orders.length, 10);
  assert.equal(d.deliveries.length, 10);
  assert.ok(d.drivers.length >= 1);
  const userIds = new Set(d.users.map(u => u.mockId));
  const driverIds = new Set(d.drivers.map(u => u.mockId));
  const orderIds = new Set(d.orders.map(o => o.mockId));
  assert.ok(d.users.every(u => u.role === USER_ROLES.USER));
  assert.ok(d.drivers.every(u => u.role === USER_ROLES.DRIVER));
  assert.ok(d.orders.every(o => userIds.has(o.customer) && Object.values(ORDER_STATUS).includes(o.status) && Object.values(ORDER_PRIORITY).includes(o.priority)));
  assert.ok(d.deliveries.every(x => orderIds.has(x.order) && (x.driver === null || driverIds.has(x.driver)) && Object.values(DELIVERY_STATUS).includes(x.status)));
  assert.equal(new Set([...d.users, ...d.drivers].map(x => x.email)).size, d.users.length + d.drivers.length);
});
