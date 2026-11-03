
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
  const errorCode = isKnownError ? error.code : 'INTERNAL_ERROR';

  const method = req?.method || 'UNKNOWN';
  const route = req?.originalUrl || req?.url || 'UNKNOWN';

  const context = [
    `code=${errorCode}`,
    `status=${statusCode}`,
    `method=${method}`,
    `route=${route}`
  ].join(' | ');

  // El stack completo se registra para errores del servidor.
  // Se mantiene fuera de la respuesta HTTP.

if (statusCode >= 500) {
  const stack = typeof err.stack === 'string'
    ? err.stack
    : '';

  // Conservamos las ubicaciones del stack, pero no
  // su primera línea, que puede contener credenciales.
  const safeStack = stack
    .split('\n')
    .slice(1)
    .filter(line => /^\s+at\s/.test(line))
    .join('\n');

  logger.error(
    `${context}${safeStack ? '\n' + safeStack : ''}`
  );
} else {
  logger.warning(context);
}


  return res.status(statusCode).json({
    status: 'error',
    code: errorCode,
    message: isKnownError
      ? error.message
      : 'Error interno del servidor'
  });
}

module.exports = errorHandler;
