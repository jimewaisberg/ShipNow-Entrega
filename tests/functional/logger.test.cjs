const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const mongoose = require('mongoose');
const ctx = require('../support.cjs');

describe('Logger - Tests funcionales', function () {
  it('GET /api/logger/test responde correctamente', async function () {
    const response = await request(ctx.app).get('/api/logger/test');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body.status).to.equal('success');
    ctx.expect(response.body.message).to.equal(
      'Prueba de logging ejecutada correctamente'
    );
  });
});
