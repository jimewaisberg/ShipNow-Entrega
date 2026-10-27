const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
test('no arranca sin MONGODB_URI', () => {
  const env = { ...process.env, PORT: '8080', NODE_ENV: 'test', MONGODB_URI: '' };
  const code = "const M = require('module'); const original = M._load; M._load = function(name, ...args) { if (name === 'dotenv') return { config: () => ({}) }; return original.call(this, name, ...args); }; require('./src/config/env.config');";
  const result = spawnSync(process.execPath, ['-e', code], { cwd: path.join(__dirname, '..'), env, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /MONGODB_URI/);
});
test('las constantes están congeladas', () => {
  const { USER_ROLES, PRODUCT_STATUS } = require('../src/constants');
  assert.ok(Object.isFrozen(USER_ROLES));
  assert.ok(Object.isFrozen(PRODUCT_STATUS));
});
