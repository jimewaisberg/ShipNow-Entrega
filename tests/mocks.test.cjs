const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const mongoose = require('mongoose');
const ctx = require('./support.cjs');

describe('Mocks - Tests funcionales', function () {
  it('GET /api/mocks/users genera usuarios ficticios', async function () {
    const response = await request(ctx.app).get('/api/mocks/users?qty=2');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.be.an('array').with.lengthOf(2);

    for (const user of response.body) {
      ctx.expect(user.mockId).to.be.a('string');
      ctx.expect(user.email).to.be.a('string');
      ctx.expect(user.role).to.be.a('string');
    }
  });

  it('GET /api/mocks/orders genera pedidos ficticios', async function () {
    const response = await request(ctx.app).get('/api/mocks/orders?qty=2');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.be.an('array').with.lengthOf(2);

    for (const order of response.body) {
      ctx.expect(order.mockId).to.be.a('string');
      ctx.expect(order.customer).to.be.a('string');
      ctx.expect(order.status).to.equal('PENDING');
      ctx.expect(order.total).to.be.a('number');
    }
  });

  it('GET /api/mocks/bundle genera datos relacionados', async function () {
    const response = await request(ctx.app).get('/api/mocks/bundle?qty=2');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.have.all.keys(
      'users', 'drivers', 'orders', 'deliveries'
    );
    ctx.expect(response.body.users).to.have.lengthOf(2);
    ctx.expect(response.body.orders).to.have.lengthOf(2);
    ctx.expect(response.body.deliveries).to.have.lengthOf(2);
  });

  it('GET /api/mocks/users rechaza cantidades inválidas', async function () {
    const response = await request(ctx.app).get('/api/mocks/users?qty=-5');

    ctx.expect(response.status).to.equal(400);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.equal('INVALID_MOCK_QUANTITY');
    ctx.expect(response.body.message).to.be.a('string');
  });

  it('POST /api/mocks/seed rechaza la carga deshabilitada', async function () {
    const response = await request(ctx.app)
      .post('/api/mocks/seed')
      .send({ qty: 2 });

    ctx.expect(response.status).to.equal(403);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.equal('MOCK_SEED_DISABLED');
    ctx.expect(response.body.message).to.be.a('string');
  });
});
