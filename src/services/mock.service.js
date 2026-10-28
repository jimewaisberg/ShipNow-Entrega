
const { randomUUID } = require('node:crypto');
const { generate, quantity } = require('./mock.generator');
const bcrypt = require('bcrypt');
const repo = require('../repositories/mock.repository');
const { AppError } = require('../errors/AppError');
const config = require('../config/env.config');

class MockService {
  preview(kind, qtyInput) {
    if (config.nodeEnv === 'production') {
      throw new AppError('MOCKS_DISABLED');
    }

    const keys = ['users', 'drivers', 'orders', 'deliveries', 'bundle'];

    if (!keys.includes(kind)) {
      throw new AppError('INVALID_MOCK_TYPE');
    }

    const data = generate(quantity(qtyInput));

    return kind === 'bundle' ? data : data[kind];
  }

  async seed(qtyInput) {
    if (config.nodeEnv === 'production' || !config.mockSeedEnabled) {
      throw new AppError('MOCK_SEED_DISABLED');
    }

    const data = generate(quantity(qtyInput));

    // Nunca guardamos contraseñas en texto plano.
    const hashed = await bcrypt.hash(randomUUID(), 10);

    try {
      return await repo.seed(data, hashed);
    } catch (error) {
      console.error('Error al insertar mocks:', error);
      throw new AppError('MOCK_SEED_FAILED');
    }
  }
}

module.exports = new MockService();
