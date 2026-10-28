
const service = require('../services/mock.service');

const wrap = fn => (req, res, next) =>
  Promise.resolve()
    .then(() => fn(req, res))
    .catch(next);

const preview = type => wrap((req, res) => {
  res.json(service.preview(type, req.query.qty));
});

module.exports = {
  users: preview('users'),
  drivers: preview('drivers'),
  orders: preview('orders'),
  deliveries: preview('deliveries'),
  bundle: preview('bundle'),

  seed: wrap(async (req, res) => {
    const result = await service.seed(req.body?.qty);
    res.status(201).json(result);
  })
};
