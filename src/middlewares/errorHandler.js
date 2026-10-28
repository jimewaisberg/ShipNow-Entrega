
const { AppError } = require('../errors/AppError');
const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  if (err.name === 'CastError') {
    error = new AppError('INVALID_DATA', 'Identificador inválido');
  } else if (err.name === 'ValidationError') {
    error = new AppError('INVALID_DATA', 'Error de validación de datos');
  } else if (err.code === 11000) {
    error = new AppError('DUPLICATE_RESOURCE');
  }

  const isKnownError = error instanceof AppError;
  const statusCode = isKnownError ? error.statusCode : 500;

  if (statusCode >= 500) {
    logger.error(
      `Error del servidor: ${isKnownError ? error.code : 'INTERNAL_ERROR'}`
    );
  } else {
    logger.warning(
      `Error controlado: ${error.code} - ${req.method} ${req.originalUrl}`
    );
  }

  return res.status(statusCode).json({
    status: 'error',
    code: isKnownError ? error.code : 'INTERNAL_ERROR',
    message: isKnownError
      ? error.message
      : 'Error interno del servidor'
  });
}

module.exports = errorHandler;
