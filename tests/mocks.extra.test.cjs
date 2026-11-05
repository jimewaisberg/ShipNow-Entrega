const { describe, it } = require('mocha');
const request = require('supertest');
const ctx = require('./support.cjs');

describe('Mocks - Cobertura adicional', function () {

  it('GET /api/mocks/drivers genera repartidores válidos', async function () {
    const response = await request(ctx.app)
      .get('/api/mocks/drivers?qty=2');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.be.an('array').with.lengthOf(1);

    for (const driver of response.body) {
      ctx.expect(driver.mockId).to.be.a('string');
      ctx.expect(driver.email).to.be.a('string');
      ctx.expect(driver.role).to.equal('driver');
    }
  });

  it('GET /api/mocks/deliveries genera entregas válidas', async function () {
    const response = await request(ctx.app)
      .get('/api/mocks/deliveries?qty=2');

    ctx.expect(response.status).to.equal(200);
    ctx.expect(response.body).to.be.an('array').with.lengthOf(2);

    for (const delivery of response.body) {
      ctx.expect(delivery.mockId).to.be.a('string');
      ctx.expect(delivery.order).to.be.a('string');
      ctx.expect(delivery.status).to.be.a('string');
      ctx.expect(delivery.destination).to.be.a('string');
      ctx.expect(delivery).to.have.property('driver');
    }
  });

  for (const endpoint of ['drivers', 'deliveries', 'orders', 'bundle']) {
    it(`GET /api/mocks/${endpoint} rechaza cantidades inválidas`, async function () {
      const response = await request(ctx.app)
        .get(`/api/mocks/${endpoint}?qty=0`);

      ctx.expect(response.status).to.equal(400);
      ctx.expect(response.body.status).to.equal('error');
      ctx.expect(response.body.code).to.equal('INVALID_MOCK_QUANTITY');
      ctx.expect(response.body.message).to.be.a('string').and.not.empty;
    });
  }

});
