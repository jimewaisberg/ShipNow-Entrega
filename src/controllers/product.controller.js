const service = require('../services/product.service');
const handler = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
exports.list = handler(async (req, res) => {
  const { page, limit, sort, query, availableOnly } = req.query;
  res.json(await service.getAll({ page: page === undefined ? 1 : Number(page), limit: limit === undefined ? 10 : Number(limit), sort, query, availableOnly: availableOnly === 'true' }));
});
exports.get = handler(async (req, res) => res.json(await service.getById(req.params.id)));
exports.create = handler(async (req, res) => res.status(201).json(await service.create(req.body)));
exports.update = handler(async (req, res) => res.json(await service.update(req.params.id, req.body)));
exports.remove = handler(async (req, res) => { await service.delete(req.params.id); res.status(204).send(); });
