
const express = require('express');
const logger = require('../config/logger');
const config = require('../config/env.config');
const { AppError } = require('../errors/AppError');

const router = express.Router();

router.get('/test', (req, res, next) => {
  if (config.nodeEnv === 'production') {
    return next(new AppError('ROUTE_NOT_FOUND'));
  }

  logger.debug('Prueba del nivel debug');
  logger.http('Prueba del nivel http');
  logger.info('Prueba del nivel info');
  logger.warning('Prueba del nivel warning');
  logger.error('Prueba del nivel error');
  logger.fatal('Prueba del nivel fatal');

  return res.json({
    status: 'success',
    message: 'Prueba de logging ejecutada correctamente'
  });
});

module.exports = router;
