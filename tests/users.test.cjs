const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const mongoose = require('mongoose');
const ctx = require('./support.cjs');

describe('Users - Tests funcionales', function () {
  beforeEach(async function () {
    await mongoose.connection.db.dropDatabase();
  });

  it('GET /api/users devuelve un listado vacío', async function () {
    const response = await request(ctx.app).get('/api/users');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.be.an('array');
    ctx.expect(response.body).to.have.length(0);
  });

  it('POST /api/users crea un usuario válido', async function () {
    const response = await request(ctx.app)
      .post('/api/users')
      .send({
        first_name: 'Ana',
        last_name: 'Prueba',
        email: 'ana@example.test',
        age: 25,
        password: 'Password123'
      });

    ctx.expect(response.status).to.equal(201);
    ctx.expect(response.body).to.have.property('_id');
    ctx.expect(response.body.email).to.equal('ana@example.test');
    ctx.expect(response.body.role).to.equal('user');
    ctx.expect(response.body).not.to.have.property('password');
  });

  it('POST /api/users rechaza datos incompletos', async function () {
    const response = await request(ctx.app)
      .post('/api/users')
      .send({ first_name: 'Ana' });

    ctx.expect(response.status).to.equal(400);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.equal('INVALID_DATA');
    ctx.expect(response.body.message).to.be.a('string');
  });
});
