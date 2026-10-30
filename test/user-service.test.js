
const { test } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

const userService = require('../src/services/user.service');
const userRepository = require('../src/repositories/user.repository');

const validUser = {
  first_name: 'Ana',
  last_name: 'García',
  email: 'ana@test.com',
  age: 25,
  password: 'claveSegura123'
};

test('User rechaza un email duplicado', async () => {
  const original = userRepository.getByEmail;

  try {
    userRepository.getByEmail = async () => ({
      _id: '507f1f77bcf86cd799439011'
    });

    await assert.rejects(
      () => userService.create(validUser),
      error =>
        error.code === 'DUPLICATE_RESOURCE' &&
        error.statusCode === 409
    );
  } finally {
    userRepository.getByEmail = original;
  }
});

test('User rechaza una contraseña demasiado corta', async () => {
  await assert.rejects(
    () => userService.create({
      ...validUser,
      password: '123'
    }),
    error =>
      error.code === 'INVALID_DATA' &&
      error.statusCode === 400
  );
});

test('User crea usuarios con rol user por defecto', async () => {
  const originals = {
    getByEmail: userRepository.getByEmail,
    create: userRepository.create,
    getById: userRepository.getById
  };

  let savedData;

  try {
    userRepository.getByEmail = async () => null;

    userRepository.create = async data => {
      savedData = data;

      return {
        _id: '507f1f77bcf86cd799439011',
        ...data
      };
    };

    userRepository.getById = async id => ({
      _id: id,
      first_name: savedData.first_name,
      last_name: savedData.last_name,
      email: savedData.email,
      age: savedData.age,
      role: savedData.role
    });

    const user = await userService.create(validUser);

    assert.equal(savedData.role, 'user');
    assert.equal(user.role, 'user');

    assert.notEqual(savedData.password, validUser.password);
    assert.equal(
      await bcrypt.compare(validUser.password, savedData.password),
      true
    );

    assert.equal(user.password, undefined);
  } finally {
    Object.assign(userRepository, originals);
  }
});
