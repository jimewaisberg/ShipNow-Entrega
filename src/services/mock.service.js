
const { randomUUID } = require('node:crypto');
const { generate, quantity } = require('./mock.generator');
const bcrypt = require('bcrypt');
const repo = require('../repositories/mock.repository');
const { AppError } = require('../errors/AppError');
const config = require('../config/env.config');
const logger = require('../config/logger');

class MockService {
  preview(kind, qtyInput) {
    if (config.nodeEnv === 'production') {
      throw new AppError('MOCKS_DISABLED');
    }

    const keys = ['users', 'drivers', 'orders', 'deliveries', 'bundle'];

    if (!keys.includes(kind)) {
      throw new AppError('INVALID_MOCK_TYPE');
    }

    const qty = quantity(qtyInput);

    logger.debug(`Generando mocks: tipo=${kind}, cantidad=${qty}`);

    const data = generate(qty);

    logger.info(`Mocks generados correctamente: tipo=${kind}, cantidad=${qty}`);

    return kind === 'bundle' ? data : data[kind];
  }

  async seed(qtyInput) {
    if (config.nodeEnv === 'production' || !config.mockSeedEnabled) {
      throw new AppError('MOCK_SEED_DISABLED');
    }

    const qty = quantity(qtyInput);

    logger.info(`Iniciando carga de mocks: cantidad=${qty}`);

    const data = generate(qty);

    // Nunca guardamos contraseñas en texto plano.
    const hashed = await bcrypt.hash(randomUUID(), 10);

    try {
      const result = await repo.seed(data, hashed);

      logger.info(`Carga de mocks completada: ${result.total} registros insertados`);

      return result;
    } catch (error) {
      logger.error('Falló la inserción de mocks en MongoDB');
      throw new AppError('MOCK_SEED_FAILED');
    }
  }
}

module.exports = new MockService();
