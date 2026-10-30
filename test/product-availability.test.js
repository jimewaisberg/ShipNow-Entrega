
const { test } = require('node:test');
const assert = require('node:assert/strict');

const Product = require('../src/models/Product');
const {
  getProductAvailability,
  withProductAvailability
} = require('../src/constants/productAvailability');

test('Product no persiste status como campo independiente', () => {
  assert.equal(Product.schema.path('status'), undefined);
  assert.ok(Product.schema.path('stock'));
});

test('Producto con stock disponible tiene estado AVAILABLE', () => {
  const product = withProductAvailability({
    title: 'Producto de prueba',
    stock: 10
  });

  assert.equal(getProductAvailability(10), 'AVAILABLE');
  assert.equal(product.status, true);
  assert.equal(product.stockStatus, 'AVAILABLE');
});

test('Producto sin stock tiene estado OUT_OF_STOCK', () => {
  const product = withProductAvailability({
    title: 'Producto de prueba',
    stock: 0
  });

  assert.equal(getProductAvailability(0), 'OUT_OF_STOCK');
  assert.equal(product.status, false);
  assert.equal(product.stockStatus, 'OUT_OF_STOCK');
});

test('La disponibilidad se recalcula aunque exista un status anterior', () => {
  const product = withProductAvailability({
    stock: 0,
    status: true,
    stockStatus: 'AVAILABLE'
  });

  assert.equal(product.status, false);
  assert.equal(product.stockStatus, 'OUT_OF_STOCK');
});
