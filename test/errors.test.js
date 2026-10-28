
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const {
  AppError,
  UserNotFoundError,
  ProductNotFoundError,
  InvalidMockQuantityError
} = require('../src/errors/AppError');

const { quantity } = require('../src/services/mock.generator');
const errorHandler = require('../src/middlewares/errorHandler');

// Prueba 1: usuario inexistente
test('usuario inexistente genera error personalizado 404', () => {
  const error = new UserNotFoundError();

  assert.equal(error.statusCode, 404);
  assert.equal(error.code, 'USER_NOT_FOUND');
  assert.equal(error.message, 'Usuario no encontrado');
});

// Prueba 2: producto inexistente
test('producto inexistente genera error personalizado 404', () => {
  const error = new ProductNotFoundError();

  assert.equal(error.statusCode, 404);
  assert.equal(error.code, 'PRODUCT_NOT_FOUND');
  assert.equal(error.message, 'Producto no encontrado');
});

// Prueba 3: cantidad negativa de mocks
test('cantidad negativa genera INVALID_MOCK_QUANTITY', () => {
  assert.throws(
    () => quantity(-5),
    error =>
      error instanceof InvalidMockQuantityError &&
      error.statusCode === 400 &&
      error.code === 'INVALID_MOCK_QUANTITY'
  );
});

// Prueba 4: formato uniforme de errores
test('middleware devuelve una estructura uniforme', () => {
  const error = new AppError('INVALID_DATA');

  let statusCode;
  let response;

  const res = {
    headersSent: false,

    status(code) {
      statusCode = code;
      return this;
    },

    json(body) {
      response = body;
      return this;
    }
  };

  errorHandler(error, {}, res, () => {});

  assert.equal(statusCode, 400);

  assert.deepEqual(response, {
    status: 'error',
    code: 'INVALID_DATA',
    message: 'Los datos proporcionados son inválidos'
  });
});

// Prueba 5: errores inesperados sin exponer información sensible
test('error inesperado de MongoDB devuelve 500 sin exponer detalles', () => {
  const error = new Error('mongodb+srv://usuario:password@cluster');

  let statusCode;
  let response;

  const res = {
    headersSent: false,

    status(code) {
      statusCode = code;
      return this;
    },

    json(body) {
      response = body;
      return this;
    }
  };

  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    errorHandler(error, {}, res, () => {});
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(statusCode, 500);

  assert.deepEqual(response, {
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'Error interno del servidor'
  });

  assert.equal(
    JSON.stringify(response).includes('password'),
    false
  );
});

// Prueba 6: definición del error de carga de mocks
test('error de carga de mocks tiene código y estado correctos', () => {
  const error = new AppError('MOCK_SEED_FAILED');

  assert.equal(error.statusCode, 500);
  assert.equal(error.code, 'MOCK_SEED_FAILED');
  assert.equal(
    error.message,
    'No se pudieron insertar los datos de prueba'
  );
});

// Prueba 7: simulación de una falla real en el repositorio de mocks
test('si falla la inserción de mocks, el servicio genera MOCK_SEED_FAILED', () => {
  const projectRoot = path.resolve(__dirname, '..');

  const script = `
    const assert = require('node:assert/strict');

    const repo = require('./src/repositories/mock.repository');

    // Simulamos una falla sin acceder a MongoDB.
    repo.seed = async () => {
      throw new Error('Falla simulada de MongoDB');
    };

    const mockService = require('./src/services/mock.service');
    const { AppError } = require('./src/errors/AppError');

    // Evitamos imprimir el error ficticio durante la prueba.
    console.error = () => {};

    (async () => {
      await assert.rejects(
        () => mockService.seed(2),
        error =>
          error instanceof AppError &&
          error.code === 'MOCK_SEED_FAILED' &&
          error.statusCode === 500
      );
    })().catch(error => {
      process.stderr.write(String(error.stack || error));
      process.exitCode = 1;
    });
  `;

  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ['-e', script], {
      cwd: projectRoot,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        MOCK_SEED_ENABLED: 'true'
      },
      stdio: 'pipe'
    });
  });
});
