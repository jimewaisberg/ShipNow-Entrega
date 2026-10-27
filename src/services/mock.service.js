const { randomUUID } = require('node:crypto');
const { generate, quantity } = require('./mock.generator');
const bcrypt = require('bcrypt');
const repo = require('../repositories/mock.repository');
const { HttpError } = require('../utils/errors');
const config = require('../config/env.config');

class MockService {
  preview(kind, qtyInput) {
    const data = generate(quantity(qtyInput));
    if (kind === 'bundle') return data;
    const key = { users: 'users', drivers: 'drivers', orders: 'orders', deliveries: 'deliveries' }[kind];
    if (!key) throw new HttpError('Tipo de mock inválido', 400);
    return data[key];
  }
  async seed(qtyInput) {
    if (config.nodeEnv === 'production' || !config.mockSeedEnabled) {
      throw new HttpError('Carga de prueba deshabilitada. Activá MOCK_SEED_ENABLED=true solo en desarrollo.', 403);
    }
    const data = generate(quantity(qtyInput));
    // Se mantiene el hash de contraseñas: jamás guardar contraseñas en texto plano.
    const hashed = await bcrypt.hash(randomUUID(), 10);
    return repo.seed(data, hashed);
  }
}
module.exports = new MockService();
