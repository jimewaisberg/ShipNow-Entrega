
const { test } = require('node:test');
const assert = require('node:assert/strict');
const swagger = require('../src/config/swagger');

test('Swagger utiliza OpenAPI 3', () => {
  assert.equal(swagger.openapi, '3.0.3');
  assert.equal(swagger.info.title, 'ShipNow API');
});

test('Swagger tiene los tags requeridos', () => {
  const tags = swagger.tags.map(tag => tag.name);

  for (const name of ['Users', 'Orders', 'Deliveries', 'Mocks', 'Logger']) {
    assert.ok(tags.includes(name), `Falta el tag ${name}`);
  }
});

test('Swagger documenta las 17 operaciones', () => {
  const total = Object.values(swagger.paths).reduce(
    (count, path) => count + Object.keys(path).length,
    0
  );

  assert.equal(total, 17);
  assert.ok(swagger.paths['/api/mocks/drivers']?.get);
  assert.ok(swagger.paths['/api/mocks/seed']?.post);
  assert.ok(swagger.paths['/api/logger/test']?.get);
});

test('Swagger define los schemas reutilizables', () => {
  const schemas = swagger.components.schemas;

  for (const name of [
    'User',
    'Order',
    'Delivery',
    'OrderItem',
    'ErrorResponse',
    'SuccessResponse',
    'Product'
  ]) {
    assert.ok(schemas[name], `Falta el schema ${name}`);
  }
});
