
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../src/app');

test('Orders y Deliveries responden correctamente por HTTP', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    const cases = [
      ['/api/orders/id-invalido', 'INVALID_DATA'],
      ['/api/deliveries/id-invalido', 'INVALID_DATA']
    ];

    for (const [path, expectedCode] of cases) {
      const response = await fetch(base + path);
      const body = await response.json();

      assert.equal(response.status, 400);
      assert.equal(body.status, 'error');
      assert.equal(body.code, expectedCode);
      assert.equal(typeof body.message, 'string');
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
  }
});
