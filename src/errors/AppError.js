
const ERROR_DICTIONARY = require('./errorDictionary');

class AppError extends Error {
  constructor(code, customMessage) {
    const definition = ERROR_DICTIONARY[code];

    if (!definition) {
      throw new Error(`Código de error desconocido: ${code}`);
    }

    super(customMessage || definition.message);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = definition.statusCode;
    this.isOperational = true;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

class UserNotFoundError extends AppError {
  constructor() {
    super('USER_NOT_FOUND');
  }
}

class ProductNotFoundError extends AppError {
  constructor() {
    super('PRODUCT_NOT_FOUND');
  }
}

class OrderNotFoundError extends AppError {
  constructor() {
    super('ORDER_NOT_FOUND');
  }
}

class InvalidMockQuantityError extends AppError {
  constructor() {
    super('INVALID_MOCK_QUANTITY');
  }
}

class InvalidStatusError extends AppError {
  constructor() {
    super('INVALID_STATUS');
  }
}

module.exports = {
  AppError,
  UserNotFoundError,
  ProductNotFoundError,
  OrderNotFoundError,
  InvalidMockQuantityError,
  InvalidStatusError
};
