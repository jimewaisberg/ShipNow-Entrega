const service = require('../services/mock.service');
const { HttpError } = require('../utils/errors');
const config = require('../config/env.config');
const wrap = fn => (req, res, next) => Promise.resolve().then(() => fn(req, res)).catch(next);
const preview = type => wrap((req, res) => {
  if (config.nodeEnv === 'production') throw new HttpError('Mocks no disponibles en producción', 403);
  res.json(service.preview(type, req.query.qty));
});
module.exports = {
  users: preview('users'),
  drivers: preview('drivers'),
  orders: preview('orders'),
  deliveries: preview('deliveries'),
  bundle: preview('bundle'),
  seed: wrap(async (req, res) => res.status(201).json(await service.seed(req.body?.qty)))
};
