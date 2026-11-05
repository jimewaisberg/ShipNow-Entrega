const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const ctx = { app: null, expect: null };
let mongoServer;

exports.mochaHooks = {
  async beforeAll() {
    this.timeout(120000);

    process.env.NODE_ENV = 'test';
    process.env.PORT = '8080';
    process.env.MOCK_SEED_ENABLED =
      process.env.TEST_ENABLE_SEED === '1' ? 'true' : 'false';

    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();

    await mongoose.connect(process.env.MONGODB_URI);

    ctx.app = require('../src/app');
    ctx.expect = (await import('chai')).expect;
  },

  async afterAll() {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  }
};

Object.defineProperties(exports, {
  app: { get: () => ctx.app },
  expect: { get: () => ctx.expect }
});
