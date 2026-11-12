const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const mongoose = require('mongoose');
const ctx = require('../support.cjs');

describe('ShipNow - Testing funcional', function () {
  it('GET /health responde correctamente', async function () {
    const response = await request(ctx.app).get('/health');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.include({
      status: 'ok',
      environment: 'test'
    });
  });

  it('GET /api/docs/ permite acceder a Swagger', async function () {
    const response = await request(ctx.app).get('/api/docs/');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.headers['content-type']).to.include('text/html');
  });

  it('Una ruta inexistente devuelve un error estructurado', async function () {
    const response = await request(ctx.app).get('/api/ruta-inexistente');

    ctx.expect(response.status).to.equal(404);
    ctx.expect(response.body.status).to.equal('error');
    ctx.expect(response.body.code).to.equal('ROUTE_NOT_FOUND');
    ctx.expect(response.body.message).to.be.a('string');
  });
});
