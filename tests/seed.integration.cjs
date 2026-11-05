const { describe, it, beforeEach, afterEach } = require('mocha');
const request = require('supertest');
const mongoose = require('mongoose');
const ctx = require('./support.cjs');

describe('Mocks - Seed real en MongoDB temporal', function () {
  beforeEach(async function () {
    if (
      process.env.NODE_ENV !== 'test' ||
      process.env.TEST_ENABLE_SEED !== '1' ||
      !process.env.MONGODB_URI.startsWith('mongodb://127.0.0.1:')
    ) {
      throw new Error('Entorno temporal de testing no confirmado');
    }

    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async function () {
    await mongoose.connection.db.dropDatabase();
  });

  it('POST /api/mocks/seed inserta datos usando el servicio real', async function () {
    const response = await request(ctx.app)
      .post('/api/mocks/seed')
      .send({ qty: 2 });

    ctx.expect(response.status).to.equal(201);
    ctx.expect(response.body.inserted).to.be.an('object');
    ctx.expect(response.body.total).to.be.greaterThan(0);
    ctx.expect(response.body.ids).to.be.an('object');

    const users = await mongoose.connection.db
      .collection('users')
      .countDocuments();

    ctx.expect(users).to.be.greaterThan(0);
  });
});

describe('Mocks - Validación del seed habilitado', function () {
  it('POST /api/mocks/seed rechaza cantidades inválidas', async function () {
    const response = await request(ctx.app)
      .post('/api/mocks/seed')
      .send({ qty: 0 });

    ctx.expect(response.status).to.equal(400);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.equal('INVALID_MOCK_QUANTITY');
    ctx.expect(response.body.message).to.be.a('string').and.not.empty;
  });
});
