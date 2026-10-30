
const { test } = require('node:test');
const assert = require('node:assert/strict');

const productService = require('../src/services/product.service');
const productRepository = require('../src/repositories/product.repository');

const validProduct = {
  title: 'Auriculares',
  code: 'AUR-001',
  price: 15000,
  stock: 10,
  category: 'Electrónica'
};

test('Product rechaza un código duplicado', async () => {
  const original = productRepository.getByCode;

  try {
    productRepository.getByCode = async () => ({
      _id: '507f1f77bcf86cd799439011'
    });

    await assert.rejects(
      () => productService.create(validProduct),
      error =>
        error.code === 'DUPLICATE_RESOURCE' &&
        error.statusCode === 409
    );
  } finally {
    productRepository.getByCode = original;
  }
});

test('Product rechaza stock negativo', async () => {
  await assert.rejects(
    () => productService.create({
      ...validProduct,
      stock: -5
    }),
    error =>
      error.code === 'INVALID_DATA' &&
      error.statusCode === 400
  );
});

test('Product rechaza stock decimal', async () => {
  await assert.rejects(
    () => productService.create({
      ...validProduct,
      stock: 2.5
    }),
    error =>
      error.code === 'INVALID_DATA' &&
      error.statusCode === 400
  );
});

test('Product crea un producto y calcula su disponibilidad', async () => {
  const originals = {
    getByCode: productRepository.getByCode,
    create: productRepository.create
  };

  let savedData;

  try {
    productRepository.getByCode = async () => null;

    productRepository.create = async data => {
      savedData = data;

      return {
        toObject: () => ({ _id: 'producto-test', ...data })
      };
    };

    const product = await productService.create(validProduct);

    assert.equal(savedData.status, undefined);
    assert.equal(product.stock, 10);
    assert.equal(product.status, true);
    assert.equal(product.stockStatus, 'AVAILABLE');
  } finally {
    Object.assign(productRepository, originals);
  }
});

test('Product actualiza stock y recalcula disponibilidad', async () => {
  const original = productRepository.update;

  try {
    productRepository.update = async (id, changes) => ({
      toObject: () => ({
        _id: id,
        title: 'Auriculares',
        stock: changes.stock,
        ...changes
      })
    });

    const product = await productService.update(
      '507f1f77bcf86cd799439011',
      { stock: 0 }
    );

    assert.equal(product.stock, 0);
    assert.equal(product.status, false);
    assert.equal(product.stockStatus, 'OUT_OF_STOCK');
  } finally {
    productRepository.update = original;
  }
});
