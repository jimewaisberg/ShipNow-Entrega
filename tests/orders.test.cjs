const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const mongoose = require('mongoose');
const ctx = require('./support.cjs');

describe('Orders - Tests funcionales', function () {
  let customerId;

  beforeEach(async function () {
    await mongoose.connection.db.dropDatabase();

    const user = await request(ctx.app)
      .post('/api/users')
      .send({
        first_name: 'Cliente',
        last_name: 'Testing',
        email: 'cliente@example.test',
        age: 30,
        password: 'Password123'
      });

    ctx.expect(user.status).to.equal(201);
    customerId = user.body._id;
  });

  it('GET /api/orders devuelve un listado', async function () {
    const response = await request(ctx.app).get('/api/orders');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.be.an('array');
    ctx.expect(response.body).to.have.length(0);
  });

  it('POST /api/orders crea un pedido válido', async function () {
    const response = await request(ctx.app)
      .post('/api/orders')
      .send({
        customer: customerId,
        total: 1500,
        priority: 'NORMAL'
      });

    ctx.expect(response.status).to.equal(201);
    ctx.expect(response.body).to.have.property('_id');
    ctx.expect(response.body.status).to.equal('PENDING');
    ctx.expect(response.body.total).to.equal(1500);
    ctx.expect(response.body.priority).to.equal('NORMAL');
  });

  it('GET /api/orders/:id consulta un pedido existente', async function () {
    const created = await request(ctx.app)
      .post('/api/orders')
      .send({ customer: customerId, total: 900 });

    ctx.expect(created.status).to.equal(201);

    const response = await request(ctx.app)
      .get(`/api/orders/${created.body._id}`);

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body._id).to.equal(created.body._id);
    ctx.expect(response.body.total).to.equal(900);
  });

  it('POST /api/orders rechaza datos incompletos', async function () {
    const response = await request(ctx.app)
      .post('/api/orders')
      .send({ total: 500 });

    ctx.expect(response.status).to.equal(400);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.equal('INVALID_DATA');
    ctx.expect(response.body.message).to.be.a('string');
  });

  it('GET /api/orders/:id devuelve 404 si no existe', async function () {
    const id = new mongoose.Types.ObjectId().toString();

    const response = await request(ctx.app)
      .get(`/api/orders/${id}`);

    ctx.expect(response.status).to.equal(404);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.be.a('string');
    ctx.expect(response.body.message).to.be.a('string');
  });
});

describe('Orders - Actualización de estados', function () {
  let orderId;

  beforeEach(async function () {
    await mongoose.connection.db.dropDatabase();

    const user = await request(ctx.app)
      .post('/api/users')
      .send({
        first_name: 'Cliente',
        last_name: 'Estados',
        email: 'estados@example.test',
        age: 30,
        password: 'Password123'
      });

    ctx.expect(user.status).to.equal(201);

    const order = await request(ctx.app)
      .post('/api/orders')
      .send({
        customer: user.body._id,
        total: 1200
      });

    ctx.expect(order.status).to.equal(201);
    orderId = order.body._id;
  });

  it('PUT /api/orders/:id actualiza el estado correctamente', async function () {
    const response = await request(ctx.app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'SHIPPED' });

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body._id).to.equal(orderId);
    ctx.expect(response.body.status).to.equal('SHIPPED');
  });

  it('PUT /api/orders/:id rechaza un estado inválido', async function () {
    const response = await request(ctx.app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'ESTADO_INVENTADO' });

    ctx.expect(response.status).to.equal(400);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.equal('INVALID_STATUS');
    ctx.expect(response.body.message).to.be.a('string');
  });
});
