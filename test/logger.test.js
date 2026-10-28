
const { test } = require('node:test');
const assert = require('node:assert/strict');
const logger = require('../src/config/logger');

test('Winston tiene los seis niveles requeridos', () => {
  assert.deepEqual(logger.levels, {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  });
});

test('Winston utiliza el nivel adecuado según el entorno', () => {
  const config = require('../src/config/env.config');

  assert.equal(
    logger.level,
    config.nodeEnv === 'production' ? 'info' : 'debug'
  );
});

test('Winston tiene salida por consola y rotación de archivos', () => {
  const transports = logger.transports;

  assert.ok(
    transports.some(transport =>
      transport.constructor.name === 'Console'
    )
  );

  assert.ok(
    transports.some(transport =>
      transport.constructor.name === 'DailyRotateFile' &&
      transport.level === 'error'
    )
  );
});
