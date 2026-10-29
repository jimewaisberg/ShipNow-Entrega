
const bcrypt = require('bcryptjs');
const repository = require('../repositories/user.repository');
const { USER_ROLES } = require('../constants');
const { AppError, UserNotFoundError } = require('../errors/AppError');

class UserService {
  async getAll() {
    return repository.getAll();
  }

  async getById(id) {
    const user = await repository.getById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async create(data) {
    const { first_name, last_name, email, age, password } = data;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !Number.isInteger(age) ||
      age < 0 ||
      typeof password !== 'string' ||
      password.length < 8
    ) {
      throw new AppError(
        'INVALID_DATA',
        'Nombre, apellido, email, edad válida y contraseña de al menos 8 caracteres son requeridos'
      );
    }

    if (await repository.getByEmail(email)) {
      throw new AppError('DUPLICATE_RESOURCE', 'Email ya registrado');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await repository.create({
      first_name,
      last_name,
      email,
      age,
      password: hashed,
      role: USER_ROLES.USER
    });

    return repository.getById(user._id);
  }

  async update(id, data) {
    const allowed = ['first_name', 'last_name', 'age'];

    const changes = Object.fromEntries(
      Object.entries(data).filter(([key]) => allowed.includes(key))
    );

    if (!Object.keys(changes).length) {
      throw new AppError('INVALID_DATA', 'No se indicaron campos editables');
    }

    const user = await repository.update(id, changes);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async delete(id) {
    const user = await repository.delete(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}

module.exports = new UserService();
