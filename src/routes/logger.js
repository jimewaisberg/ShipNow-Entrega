
const express = require('express');
const logger = require('../config/logger');
const config = require('../config/env.config');
const { AppError } = require('../errors/AppError');

const router = express.Router();

/**
 * @openapi
 * /api/logger/test:
 *   get:
 *     tags:
 *       - Logger
 *     summary: Probar los niveles del logger
 *     description: >
 *       Herramienta interna de validación, no es una funcionalidad
 *       de negocio. En desarrollo genera mensajes Winston en los
 *       niveles debug, http, info, warning, error y fatal.
 *       Los niveles error y fatal también se guardan en archivos
 *       rotativos dentro de logs/.
 *       En producción, este endpoint devuelve 404.
 *     responses:
 *       '200':
 *         description: Prueba de logging ejecutada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: success
 *               message: Prueba de logging ejecutada correctamente
 *       '404':
 *         description: Endpoint no disponible en producción (ROUTE_NOT_FOUND).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               code: ROUTE_NOT_FOUND
 *               message: Ruta no encontrada
 */

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
