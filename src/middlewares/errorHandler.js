
const { AppError } = require('../errors/AppError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // Errores de identificadores incorrectos en MongoDB
  if (err.name === 'CastError') {
    error = new AppError('INVALID_DATA', 'Identificador inválido');
  }

  // Errores de validación de Mongoose
  else if (err.name === 'ValidationError') {
    error = new AppError('INVALID_DATA', 'Error de validación de datos');
  }

  // Recursos duplicados en MongoDB
  else if (err.code === 11000) {
    error = new AppError('DUPLICATE_RESOURCE');
  }

  const isKnownError = error instanceof AppError;
  const statusCode = isKnownError ? error.statusCode : 500;

  if (!isKnownError) {
    console.error('Error inesperado:', err);
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
